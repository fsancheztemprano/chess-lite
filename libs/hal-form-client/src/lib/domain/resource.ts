import { Observable } from 'rxjs';
import { AffordanceOptions, DEFAULT_LINK, DEFAULT_TEMPLATE, HalFormsEntityName, noEntityError } from './domain';
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
  public _links?: {
    self: Link;
    [key: string]: Link;
  };

  public _embedded?: {
    [key: string]: IResource[] | IResource;
  };

  public _templates?: {
    default: Template;
    [key: string]: Template;
  };

  [key: string]: any;

  public static of(iResource?: IResource) {
    return new Resource(iResource);
  }

  constructor(iResource?: IResource) {
    if (!iResource) {
      iResource = {};
    }
    for (const property of Object.keys(iResource)) {
      this[property] = iResource[property];
    }

    if (iResource._links) {
      this._links = Object.keys(iResource._links)
        .map((key) => ({ [key]: Link.of(iResource!._links![key]) }))
        .reduce((previous, current) => ({ ...previous, ...current }), {}) as any;
    }

    this._embedded = iResource._embedded;

    if (iResource._templates) {
      this._templates = Object.keys(iResource._templates)
        .map((key) => ({ [key]: Template.of({ target: this._links?.self?.href, ...iResource!._templates![key] }) }))
        .reduce((previous, current) => ({ ...previous, ...current }), {}) as any;
    }
  }

  public getLink(key?: string): Link | null {
    key = key || DEFAULT_LINK;
    if (!this._links || !this._links[key]) {
      return null;
    }
    return this._links[key];
  }

  public getLinkOrThrow(key?: string, errorMessage?: string | Error): Link {
    const link = this.getLink(key);
    if (!link) {
      throw noEntityError(errorMessage, HalFormsEntityName.LINK, key || DEFAULT_LINK);
    }
    return link;
  }

  public hasLink(key?: string): boolean {
    return !!this.getLink(key)?.href?.length;
  }

  public getEmbedded<T = Resource>(key: string): T | T[] | null {
    if (!key || !key.length || !this._embedded || !this._embedded[key]) {
      return null;
    }

    if (Array.isArray(this._embedded[key])) {
      return this._embedded[key].map((element: IResource) => new Resource(element));
    }
    return new Resource(this._embedded[key]) as any as T;
  }

  public getEmbeddedOrThrow<T = Resource>(key: string, errorMessage?: string | Error): T | T[] {
    const embedded = this.getEmbedded<T>(key);
    if (embedded) {
      return embedded;
    } else {
      throw noEntityError(errorMessage, HalFormsEntityName.EMBEDDED, key);
    }
  }

  public hasEmbedded(key: string): boolean {
    return !!this.getEmbedded(key);
  }

  public hasEmbeddedCollection(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && Array.isArray(embedded);
  }

  public getEmbeddedCollection<T = Resource>(key: string): T[] {
    return this.getEmbeddedOrThrow<T>(key) as T[];
  }

  public hasEmbeddedObject(key: string): boolean {
    const embedded = this.getEmbedded(key);
    return !!embedded && !Array.isArray(embedded);
  }

  public getEmbeddedObject<T = Resource>(key: string): T {
    return this.getEmbeddedOrThrow<T>(key) as T;
  }

  public getTemplate(key?: string): Template | null {
    key = key || DEFAULT_TEMPLATE;
    if (!this._templates || !this._templates[key]) {
      return null;
    }
    return this._templates[key];
  }

  public getTemplateOrThrow(key?: string, errorMessage?: string | Error): Template {
    const template = this.getTemplate(key);
    if (!template) {
      throw noEntityError(errorMessage, HalFormsEntityName.TEMPLATE, key || DEFAULT_TEMPLATE);
    }
    return template;
  }

  public hasTemplate(template?: string): boolean {
    return !!this.getTemplate(template);
  }

  public submitToTemplateOrThrow<T extends Resource = Resource>(
    template?: string,
    options?: AffordanceOptions,
  ): Observable<T> {
    return this.getTemplateOrThrow(template).submit<T>(options);
  }

  public toJson(): IResource {
    return JSON.parse(JSON.stringify({ ...this, _links: this.linksToJson(), _templates: this.templatesToJson() }));
  }

  private linksToJson(): { [key: string]: ILink } | undefined {
    return this._links
      ? Object.keys(this._links)
          .map((key) => ({ [key]: this._links![key]?.toJson() }))
          .reduce((previous, current) => ({ ...previous, ...current }), {})
      : undefined;
  }

  private templatesToJson(): { [key: string]: ITemplate } | undefined {
    return this._templates
      ? Object.keys(this._templates)
          .map((key) => ({ [key]: this._templates![key]?.toJson() }))
          .reduce((previous, current) => ({ ...previous, ...current }), {})
      : undefined;
  }
}
