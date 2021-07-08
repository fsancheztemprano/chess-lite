import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { last } from 'rxjs/operators';
import { InjectorInstance } from '../hal-form-client.module';
import { ContentTypeEnum } from './content-type.enum';
import { HTTP_METHODS, HttpMethodEnum } from './http-method.enum';
import { ILink, Link } from './link';

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
  method: HttpMethodEnum;
  title?: string;
  contentType?: ContentTypeEnum;
  properties?: ITemplateProperty[];
  target?: string;
}

export class Template implements ITemplate {
  private httpClient: HttpClient = InjectorInstance.get(HttpClient);

  method: HttpMethodEnum;
  title?: string;
  contentType?: ContentTypeEnum;
  properties?: ITemplateProperty[];
  target?: string;
  targetLink?: Link;

  constructor(raw: ITemplate, link?: Link) {
    this.method = raw.method;
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

  submit<T = any>(payload?: any, params?: any, observe: 'body' | 'events' | 'response' = 'body'): Observable<T> {
    return this.submitToTarget(this.targetLink as any, payload, params, observe);
  }

  submitToTarget<T = any>(
    link: Link,
    body?: any,
    params?: any,
    observe: 'body' | 'events' | 'response' = 'body'
  ): Observable<T> {
    if (!link?.href) {
      return throwError(() => new Error('Invalid link'));
    }
    if (!HTTP_METHODS.includes(this.method.toUpperCase())) {
      return throwError(() => new Error(`Method ${this.method} is not supported`));
    }
    let headers = new HttpHeaders({ Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS });
    if (body) {
      headers = headers.append('Content-Type', this.contentType || ContentTypeEnum.APPLICATION_JSON);
    }
    const url = link.parseUrl(params || {});
    return url
      ? this.httpClient.request(this.method, url, { headers, body, observe }).pipe(last())
      : throwError(() => new Error(`Un-parsable Url ${link?.href},  ${params}`));
  }

  public getProperty(name: string): ITemplateProperty | undefined {
    return this.properties?.find((prop) => prop.name === name);
  }
}
