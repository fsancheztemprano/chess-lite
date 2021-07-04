import { ILink, Link } from './link';
import { ContentTypeEnum } from './content-type.enum';
import { HTTP_METHODS, HttpMethodEnum } from './http-method.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InjectorInstance } from '@chess-lite/hal-form-client';
import { Observable, throwError } from 'rxjs';
import { last } from 'rxjs/operators';

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

  submitToTarget<T>(link: Link, payload?: any, params?: any): Observable<T> {
    if (!link?.href) {
      return throwError(() => new Error('Invalid link'));
    }
    if (!HTTP_METHODS.includes(this.method.toUpperCase())) {
      return throwError(() => new Error(`Method ${this.method} is not supported`));
    }
    const headers = new HttpHeaders({
      'Content-Type': this.contentType || ContentTypeEnum.APPLICATION_JSON,
      Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
    });
    const url = link.parseUrl(params);
    return url
      ? this.httpClient.request<T>(this.method.toUpperCase(), url, { headers, body: payload }).pipe(last())
      : throwError(() => new Error(`Un-parsable Url ${link?.href},  ${params}`));
  }

  submit(payload: any, params: any): Observable<any> {
    return this.submitToTarget(this.targetLink as any, payload, params);
  }
}
