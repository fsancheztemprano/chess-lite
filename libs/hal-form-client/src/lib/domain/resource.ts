import { Observable } from 'rxjs';
import { notAllowedError } from '../utils/exceptions.utils';
import { HttpMethodEnum } from './http-method.enum';
import { ILink, Link } from './link';
import { ITemplate, Template } from './template';

export interface IResource {
  _links?: {
    self: ILink;
    [key: string]: ILink;
  };

  _embedded?: {
    [key: string]: IResource[];
  };

  _templates?: {
    default: ITemplate;
    [name: string]: ITemplate;
  };

  [key: string]: any;

  as?<T>(): T;

  getLink?(key: string): Link | null;

  hasLink?(key: string): boolean;

  getContent?(key: string): Resource[] | null;

  getTemplate?(key: string): Template | null;

  isAllowedTo?(template: string): boolean;

  submit?(method: HttpMethodEnum, payload: any, params?: any): Observable<any>;
}

export class Resource implements IResource {
  _links?: {
    self: Link;
    [key: string]: Link;
  };

  _embedded?: {
    [key: string]: IResource[];
  };

  _templates?: {
    default: Template;
    [key: string]: Template;
  };

  [key: string]: any;

  constructor(raw: IResource) {
    for (const property of Object.keys(raw)) {
      this[property] = raw[property];
    }

    this._links = {} as any;
    for (const key of Object.keys(raw._links || {})) {
      if (this._links && raw._links) {
        this._links[key] = new Link(raw._links[key]);
      }
    }

    this._embedded = raw._embedded;

    if (raw._templates) {
      this._templates = {} as any;
      for (const key of Object.keys(raw._templates)) {
        if (this._templates) {
          this._templates[key] = new Template(raw._templates[key], this._links?.self);
        }
      }
    }
  }

  as<T>() {
    return this as any as T;
  }

  getLink(key: string = 'self'): Link | null {
    if (!this._links || !this._links[key]) {
      return null;
    }
    return this._links[key];
  }

  getAssuredLink(key: string = 'self'): Link {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.getLink(key)!;
  }

  hasLink(key: string = 'self'): boolean {
    return !!this.getLink(key)?.href;
  }

  getContent(key: string): Resource[] | null {
    if (!this._embedded || !this._embedded[key]) {
      return null;
    }
    return this._embedded[key].map((element: IResource) => {
      return new Resource(element);
    });
  }

  getTemplate(key: string = 'default'): Template | null {
    if (!this._templates || !this._templates[key]) {
      return null;
    }
    return this._templates[key];
  }

  getAssuredTemplate(key: string = 'self'): Template {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.getTemplate(key)!;
  }

  isAllowedTo(template: string = 'default'): boolean {
    return !!this.getTemplate(template);
  }

  submit(method: HttpMethodEnum, payload?: any, params?: any): Observable<any> {
    return new Template({ method }, this._links?.self).submit(payload, params);
  }

  submitToTemplateOrThrow(
    templateName: string,
    payload?: any,
    params?: any,
    observe: 'body' | 'events' | 'response' = 'body',
  ): Observable<any> {
    return this.getTemplate(templateName)
      ? this.getAssuredTemplate(templateName).submit(payload, params, observe || 'body')
      : notAllowedError(templateName);
  }
}
