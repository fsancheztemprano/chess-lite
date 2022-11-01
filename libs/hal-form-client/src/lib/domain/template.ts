import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { INJECTOR_INSTANCE } from '../hal-form-client.module';
import { parseUrl } from '../utils/url-template.utils';
import { AffordanceOptions, ContentType, HttpMethod, SUPPORTED_HTTP_METHODS } from './domain';
import { ILink } from './link';
import { IResource, Resource } from './resource';

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

  [key: string]: any;
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

export class Template implements ITemplate {
  private http?: HttpClient;

  public method: HttpMethod | string;
  public title?: string;
  public contentType?: ContentType | string;
  public properties?: ITemplateProperty[];
  public target?: string;

  public static of(iTemplate?: ITemplate): Template {
    return new Template(iTemplate);
  }

  constructor(iTemplate?: ITemplate) {
    this.method = iTemplate?.method || HttpMethod.GET;
    if (iTemplate) {
      this.target = iTemplate.target;
      if (iTemplate.contentType) {
        this.contentType = iTemplate.contentType;
      }

      if (iTemplate.title) {
        this.title = iTemplate.title;
      }

      if (iTemplate.properties) {
        this.properties = iTemplate.properties;
      }
    }
  }

  public afford<T extends Resource = Resource>(options?: AffordanceOptions): Observable<T> {
    return this.affordRaw<T>(options).pipe(map((response: IResource | null) => new Resource(response || {}) as T));
  }

  public affordRaw<T extends IResource = IResource>(options?: AffordanceOptions): Observable<T | null> {
    return this.request<T>(options).pipe(map((response: HttpResponse<T>) => response.body));
  }

  public request<T>(options?: AffordanceOptions): Observable<HttpResponse<T>> {
    if (!this.target?.length) {
      return throwError(() => new Error('Template has no target'));
    }
    if (!SUPPORTED_HTTP_METHODS.includes(this.method)) {
      return throwError(() => new Error(`Http Method ${this.method} not supported`));
    }
    if (!this.http) {
      this.http = INJECTOR_INSTANCE.get(HttpClient);
    }
    const contentType = this.contentType || (options?.body && ContentType.APPLICATION_JSON);
    return this.http.request<T>(this.method, parseUrl(this.target, options?.parameters), {
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        ...(contentType && { 'Content-Type': contentType }),
        ...options?.headers,
      },
      context: options?.context,
      body: options?.body,
      observe: 'response',
    });
  }

  public getProperty(name?: string): ITemplateProperty | undefined {
    return this.properties?.find((property) => property.name === name);
  }

  public setProperty(property: string, key: string, value: any): this {
    if (!property || !key) {
      return this;
    }
    const existing: ITemplateProperty | undefined = this.getProperty(property);
    if (existing) {
      existing[key] = value;
    } else {
      if (!this.properties) {
        this.properties = [];
      }
      this.properties.push({ name: property, [key]: value });
    }
    return this;
  }

  public canAfford(body?: any): boolean {
    if (!this.properties?.length) {
      return true;
    }
    return this.properties.every((property) => this._canSetProperty(property, body?.[property.name]));
  }

  public canAffordProperty(name?: string, value?: any): boolean {
    return this._canSetProperty(this.getProperty(name), value);
  }

  public _canSetProperty(property?: ITemplateProperty, value?: any): boolean {
    if (!property) {
      return false;
    }
    if (property.readOnly) {
      return true;
    }
    if (property.required && value === undefined) {
      return false;
    }
    if (property.regex && value && !value.match(property.regex)) {
      return false;
    }
    return true;
  }

  public toJson(): ITemplate {
    return JSON.parse(JSON.stringify({ ...this, http: undefined }));
  }
}
