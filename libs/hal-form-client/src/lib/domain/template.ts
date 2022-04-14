import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { INJECTOR_INSTANCE } from '../hal-form-client.module';
import { ContentTypeEnum } from './content-type.enum';
import { HTTP_METHODS, HttpMethodEnum } from './http-method.enum';
import { ILink, Link } from './link';
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

export class Template implements ITemplate {
  private readonly http: HttpClient = INJECTOR_INSTANCE.get(HttpClient);

  method: HttpMethodEnum | string;
  title?: string;
  contentType?: ContentTypeEnum | string;
  properties?: ITemplateProperty[];
  target?: string;
  targetLink?: Link;

  public static of(raw: ITemplate, link?: Link): Template {
    return new Template(raw, link);
  }

  constructor(raw: ITemplate, link?: Link) {
    this.method = raw.method || HttpMethodEnum.GET;
    this.properties = raw.properties;
    if (raw.contentType) {
      this.contentType = raw.contentType;
    }

    if (raw.title) {
      this.title = raw.title;
    }

    if (raw.target) {
      this.target = raw.target;
      this.targetLink = new Link({
        href: raw.target,
        templated: raw.target.includes('{') && raw.target.includes('}'),
      });
    } else if (link) {
      this.targetLink = link;
    }
  }

  submit<T extends Resource = Resource>(options?: AffordanceOptions): Observable<T> {
    return this.afford<T>(options).pipe(map((response: HttpResponse<T>) => new Resource(response.body || {}) as T));
  }

  afford<T>(options?: AffordanceOptions): Observable<HttpResponse<T>> {
    if (!this.targetLink?.href?.length) {
      return throwError(() => new Error('Invalid link'));
    }
    if (!HTTP_METHODS.includes(this.method.toUpperCase())) {
      return throwError(() => new Error(`Method ${this.method} is not supported`));
    }
    const headers: any = { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS };
    if (options?.body && this.contentType !== ContentTypeEnum.MULTIPART_FILE) {
      headers['Content-Type'] = this.contentType || ContentTypeEnum.APPLICATION_JSON;
    }
    const url = this.targetLink.parseHref(options?.params || {});
    return url
      ? this.http
          .request<T>(this.method, url, {
            headers: { ...headers, ...options?.headers },
            body: options?.body,
            observe: 'response',
          })
          .pipe(first())
      : throwError(() => new Error(`Un-parsable Url ${this.targetLink?.href},  ${options?.params}`));
  }

  public getProperty(name: string): ITemplateProperty | undefined {
    return this.properties?.find((prop) => prop.name === name);
  }

  public setProperty(property: string, key: string, value: any): this {
    if (!property || !key) {
      return this;
    }
    const find: any = this.getProperty(property);

    if (find) {
      find[key] = value;
    } else {
      if (!this.properties) {
        this.properties = [];
      }
      this.properties.push({ [key]: value } as any);
    }
    return this;
  }
}

export interface AffordanceOptions {
  body?: any;
  params?: any;
  observe?: 'body' | 'events' | 'response';
  headers?: HttpHeaders | { [p: string]: string | string[] };
}
