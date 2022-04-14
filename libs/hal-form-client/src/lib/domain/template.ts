import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { INJECTOR_INSTANCE } from '../hal-form-client.module';
import { parseUrl } from '../utils/url-template.utils';
import { ContentTypeEnum } from './content-type.enum';
import { HttpMethodEnum } from './http-method.enum';
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
  method?: HttpMethodEnum | string;
  title?: string;
  contentType?: ContentTypeEnum | string;
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

  method: HttpMethodEnum | string;
  title?: string;
  contentType?: ContentTypeEnum | string;
  properties?: ITemplateProperty[];
  target?: string;

  public static of(raw: ITemplate): Template {
    return new Template(raw);
  }

  constructor(raw: ITemplate) {
    this.method = raw.method || HttpMethodEnum.GET;
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
    const headers: any = { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS };
    if (options?.body && this.contentType !== ContentTypeEnum.MULTIPART_FILE) {
      headers['Content-Type'] = this.contentType || ContentTypeEnum.APPLICATION_JSON;
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
}
