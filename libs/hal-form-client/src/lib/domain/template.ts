import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { INJECTOR_INSTANCE } from '../hal-form-client.module';
import { parseUrl } from '../utils/url-template.utils';
import { ContentType, HttpMethod } from './domain';
import { ILink } from './link';
import { Resource } from './resource';

export interface ITemplateProperty {
  name: string;
  prompt?: string;
  readOnly?: boolean;
  regex?: string;
  required?: boolean;
  templated?: boolean;
  value?: string;
  cols?: number;
  rows?: number;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  step?: number;
  type?: string;
  options?: ITemplatePropertyOption[];
}

export interface ITemplatePropertyOption {
  inline?: string[];
  link?: ILink;
  maxItems?: number;
  minItems?: number;
  promptField?: string;
  selectedValues?: string[];
  valueField?: string;
}

export interface ITemplate {
  method?: HttpMethod | string;
  title?: string;
  contentType?: ContentType | string;
  properties?: ITemplateProperty[];
  target?: string;
}

export interface AffordanceOptions {
  body?: any;
  params?: any;
  observe?: 'body' | 'events' | 'response';
  headers?: HttpHeaders | { [p: string]: string | string[] };
}

export class Template implements ITemplate {
  private readonly http: HttpClient = INJECTOR_INSTANCE.get(HttpClient);

  method: HttpMethod | string;
  title?: string;
  contentType?: ContentType | string;
  properties?: ITemplateProperty[];
  target?: string;

  public static of(raw: ITemplate): Template {
    return new Template(raw);
  }

  constructor(raw: ITemplate) {
    this.method = raw.method || HttpMethod.GET;
    this.target = raw.target;
    if (raw.contentType) {
      this.contentType = raw.contentType;
    }

    if (raw.title) {
      this.title = raw.title;
    }

    if (raw.properties) {
      this.properties = raw.properties;
    }
  }

  submit<T extends Resource = Resource>(options?: AffordanceOptions): Observable<T> {
    return this.afford<T>(options).pipe(map((response: HttpResponse<T>) => new Resource(response.body || {}) as T));
  }

  afford<T>(options?: AffordanceOptions): Observable<HttpResponse<T>> {
    if (!this.target?.length) {
      return throwError(() => new Error('Template has no target'));
    }
    const headers: any = { Accept: ContentType.APPLICATION_JSON_HAL_FORMS };
    if (options?.body && this.contentType !== ContentType.MULTIPART_FILE) {
      headers['Content-Type'] = this.contentType || ContentType.APPLICATION_JSON;
    }
    return this.http.request<T>(this.method, parseUrl(this.target, options?.params), {
      headers: { ...headers, ...options?.headers },
      body: options?.body,
      observe: 'response',
    });
  }

  public getProperty(name: string): ITemplateProperty | undefined {
    return this.properties?.find((prop) => prop.name === name);
  }

  public setProperty(property: string, key: string, value: any): this {
    if (!property || !key) {
      return this;
    }
    const existing: any = this.getProperty(property);
    if (existing) {
      existing[key] = value;
    } else {
      if (!this.properties) {
        this.properties = [];
      }
      this.properties.push({ name: property, [key]: value } as any);
    }
    return this;
  }

  isAllowedTo(body: any): boolean {
    if (!this.properties) {
      return true;
    }
    return this.properties.every((prop) => {
      if (prop.readOnly) {
        return true;
      }
      if (prop.required && !body[prop.name]) {
        return false;
      }
      if (prop.regex && body[prop.name] && !body[prop.name].match(prop.regex)) {
        return false;
      }
      return true;
    });
  }
}
