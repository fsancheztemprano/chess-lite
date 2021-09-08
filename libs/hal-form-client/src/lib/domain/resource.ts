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
    if (!raw) {
      raw = {};
    }
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

  getLink(key: string = 'self'): Link | null {
    if (!key || !key.length || !this._links || !this._links[key]) {
      return null;
    }
    return this._links[key];
  }

  getLinkOrThrow(key: string = 'self', errorMessage?: string | Error): Link {
    const link = this.getLink(key);
    console.log(this);
    if (link) {
      return link;
    } else {
      let error;
      if (errorMessage) {
        if (typeof errorMessage === 'string') {
          error = Error(errorMessage);
        } else {
          error = errorMessage;
        }
      } else {
        error = Error(`Can not find link: ${key}`);
      }
      throw error;
    }
  }

  getAssuredLink(key: string = 'self'): Link {
    return this.getLink(key) as Link;
  }

  hasLink(key: string = 'self'): boolean {
    return !!this.getLink(key)?.href;
  }

  getEmbedded<T = Resource>(key: string): T | T[] | null {
    if (!key || !key.length || !this._embedded || !this._embedded[key]) {
      return null;
    }

    if (Array.isArray(this._embedded[key])) {
      return this._embedded[key].map((element: IResource) => new Resource(element));
    }
    return new Resource(this._embedded[key]) as any as T;
  }

  hasEmbedded(key: string): boolean {
    return !!this.getEmbedded(key);
  }

  getAssuredEmbedded<T = Resource>(key: string): T | T[] {
    return this.getEmbedded<T>(key) as T | T[];
  }

  hasEmbeddedCollection(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && Array.isArray(embedded);
  }

  getEmbeddedCollection<T = Resource>(key: string): T[] {
    return (this.getAssuredEmbedded<T>(key) as T[]) || [];
  }

  hasEmbeddedObject(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && !Array.isArray(embedded);
  }

  getEmbeddedObject<T = Resource>(key: string): T {
    return this.getAssuredEmbedded<T>(key) as T;
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
  ): Observable<Resource> {
    return this.getTemplate(templateName)
      ? this.getAssuredTemplate(templateName).submit(payload, params, observe || 'body')
      : notAllowedError(templateName);
  }
}
