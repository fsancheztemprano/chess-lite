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
    [key: string]: IResource[] | IResource;
  };

  _templates?: {
    default: ITemplate;
    [name: string]: ITemplate;
  };

  [key: string]: any;

  as?<T>(): T;

  getLink?(key: string): Link | null;

  hasLink?(key: string): boolean;

  getEmbedded?(key: string): Resource | Resource[] | null;

  getTemplate?(key: string): Template | null;

  isAllowedTo?(template: string): boolean;

  submit?(method: HttpMethodEnum, payload: any, params?: any): Observable<any>;

  getAssuredLink?(key: string): Link;

  hasEmbedded?(key: string): boolean;

  getAssuredEmbedded?(key: string): Resource | Resource[];

  hasEmbeddedCollection?(key: string): boolean;

  getEmbeddedCollection?(key: string): Resource[];

  hasEmbeddedObject?(key: string): boolean;

  getEmbeddedObject?(key: string): Resource;

  getAssuredTemplate?(key: string): Template;

  submitToTemplateOrThrow?(templateName: string, payload?: any, params?: any, observe?: string): Observable<any>;
}

export class Resource implements IResource {
  _links?: {
    self: Link;
    [key: string]: Link;
  };

  _embedded?: {
    [key: string]: IResource[] | IResource;
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
    if (!key || !key.length || !this._links || !this._links[key]) {
      return null;
    }
    return this._links[key];
  }

  getAssuredLink(key: string = 'self'): Link {
    return this.getLink(key) as Link;
  }

  hasLink(key: string = 'self'): boolean {
    return !!this.getLink(key)?.href;
  }

  getEmbedded(key: string): Resource | Resource[] | null {
    if (!key || !key.length || !this._embedded || !this._embedded[key]) {
      return null;
    }

    if (Array.isArray(this._embedded[key])) {
      return this._embedded[key].map((element: IResource) => new Resource(element));
    }
    return new Resource(this._embedded[key]);
  }

  hasEmbedded(key: string): boolean {
    return !!this.getEmbedded(key);
  }

  getAssuredEmbedded(key: string): Resource | Resource[] {
    return this.getEmbedded(key) as Resource | Resource[];
  }

  hasEmbeddedCollection(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && Array.isArray(embedded);
  }

  getEmbeddedCollection(key: string): Resource[] {
    return this.getAssuredEmbedded(key) as Resource[];
  }

  hasEmbeddedObject(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && !Array.isArray(embedded);
  }

  getEmbeddedObject(key: string): Resource {
    return this.getAssuredEmbedded(key) as Resource;
  }

  getTemplate(key: string = 'default'): Template | null {
    if (!key || !key.length || !this._templates || !this._templates[key]) {
      return null;
    }
    return this._templates[key];
  }

  getAssuredTemplate(key: string = 'self'): Template {
    return this.getTemplate(key) as Template;
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
