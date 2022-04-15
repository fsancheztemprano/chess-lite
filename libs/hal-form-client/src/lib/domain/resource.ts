import { Observable } from 'rxjs';
import { HalFormsEntityName } from './domain';
import { ILink, Link } from './link';
import { AffordanceOptions, ITemplate, Template } from './template';

export const DEFAULT_LINK = 'self';

export const DEFAULT_TEMPLATE = 'default';

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

function noEntityError(errorMessage: string | Error | undefined, entity: HalFormsEntityName, key: string): Error {
  let error;
  if (errorMessage) {
    if (typeof errorMessage === 'string') {
      error = Error(errorMessage);
    } else {
      error = errorMessage;
    }
  } else {
    error = Error(`Can not find ${entity}: ${key}`);
  }
  return error;
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

  public static of(raw?: IResource) {
    return new Resource(raw);
  }

  constructor(raw?: IResource) {
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
        this._templates![key] = new Template({ target: this._links!.self?.href, ...raw._templates[key] });
      }
    }
  }

  getLink(key?: string): Link | null {
    key = key || DEFAULT_LINK;
    if (!this._links || !this._links[key]) {
      return null;
    }
    return this._links[key];
  }

  getLinkOrThrow(key?: string, errorMessage?: string | Error): Link {
    const link = this.getLink(key);
    if (!link) {
      throw noEntityError(errorMessage, HalFormsEntityName.LINK, key || DEFAULT_LINK);
    }
    return link;
  }

  hasLink(key?: string): boolean {
    return !!this.getLink(key)?.href?.length;
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

  getTemplate(key?: string): Template | null {
    key = key || DEFAULT_TEMPLATE;
    if (!this._templates || !this._templates[key]) {
      return null;
    }
    return this._templates[key];
  }

  getTemplateOrThrow(key?: string, errorMessage?: string | Error): Template {
    const template = this.getTemplate(key);
    if (!template) {
      throw noEntityError(errorMessage, HalFormsEntityName.TEMPLATE, key || DEFAULT_TEMPLATE);
    }
    return template;
  }

  hasTemplate(template?: string): boolean {
    return !!this.getTemplate(template);
  }

  submitToTemplateOrThrow<T extends Resource = Resource>(
    template?: string,
    options?: AffordanceOptions,
  ): Observable<T> {
    return this.getTemplateOrThrow(template).submit<T>(options);
  }
}
