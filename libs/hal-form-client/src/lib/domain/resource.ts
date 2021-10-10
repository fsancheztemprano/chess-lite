import { Observable } from 'rxjs';
import { HalFormsEntityName, noEntityError } from '../utils/exceptions.utils';
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
    if (link) {
      return link;
    } else {
      throw noEntityError(errorMessage, HalFormsEntityName.LINK, key);
    }
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

  getEmbeddedOrThrow<T = Resource>(key: string, errorMessage?: string | Error): T | T[] {
    const embedded = this.getEmbedded<T>(key);
    if (embedded) {
      return embedded;
    } else {
      throw noEntityError(errorMessage, HalFormsEntityName.EMBEDDED, key);
    }
  }

  hasEmbedded(key: string): boolean {
    return !!this.getEmbedded(key);
  }

  hasEmbeddedCollection(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && Array.isArray(embedded);
  }

  getEmbeddedCollection<T = Resource>(key: string): T[] {
    return this.getEmbeddedOrThrow<T>(key) as T[];
  }

  hasEmbeddedObject(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && !Array.isArray(embedded);
  }

  getEmbeddedObject<T = Resource>(key: string): T {
    return this.getEmbeddedOrThrow<T>(key) as T;
  }

  getTemplate(key: string = 'default'): Template | null {
    if (!key || !key.length || !this._templates || !this._templates[key]) {
      return null;
    }
    return this._templates[key];
  }

  getTemplateOrThrow(key: string = 'default', errorMessage?: string | Error): Template {
    const template = this.getTemplate(key);
    if (template) {
      return template;
    } else {
      throw noEntityError(errorMessage, HalFormsEntityName.TEMPLATE, key);
    }
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
    return this.getTemplateOrThrow(templateName).submit(payload, params, observe || 'body');
  }
}
