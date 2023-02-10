/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Observable, switchMap, take } from 'rxjs';
import {
  AffordanceOptions,
  DEFAULT_LINK,
  DEFAULT_TEMPLATE,
  HalFormsEntityName,
  LinkOptions,
  noEntityError,
} from './domain';
import { ILink, Link } from './link';
import { ITemplate, Template } from './template';

export interface IResource {
  _links?: {
    self?: ILink;
    [key: string]: ILink | undefined;
  };

  _embedded?: {
    [key: string]: IResource[] | IResource;
  };

  _templates?: {
    default?: ITemplate;
    [name: string]: ITemplate | undefined;
  };

  [key: string]: any;
}

export class Resource implements IResource {
  public _links?: {
    self?: Link;
    [key: string]: Link | undefined;
  };

  public _embedded?: { [p: string]: Resource[] | Resource };

  public _templates?: {
    default?: Template;
    [name: string]: Template | undefined;
  };

  [key: string]: any;

  public static of(iResource?: IResource): Resource {
    return new Resource(iResource);
  }

  constructor(data?: IResource) {
    const iResource = data || {};

    for (const property of Object.keys(iResource)) {
      this[property] = iResource[property];
    }

    if (iResource._links) {
      this._links = Object.keys(iResource._links)
        .map((key) => ({ [key]: Link.of(iResource!._links![key]) }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});
    }

    if (iResource._embedded) {
      this._embedded = Object.keys(iResource._embedded as any)
        .map((key) => ({
          [key]: Array.isArray(iResource!._embedded![key])
            ? iResource!._embedded![key].map((res: IResource) => Resource.of(res))
            : Resource.of(iResource!._embedded![key]),
        }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});
    }

    if (iResource._templates) {
      this._templates = Object.keys(iResource._templates)
        .map((key) => ({
          [key]: Template.of({
            target: this._links?.self?.href,
            ...iResource!._templates![key],
          }),
        }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});
    }
  }

  public getLink(key?: string): Link | null {
    key = key || DEFAULT_LINK;
    if (!this._links || !this._links[key]) {
      return null;
    }
    return this._links[key] || null;
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

  public followLink<T extends Resource = Resource>(options?: LinkOptions & { link?: string }): Observable<T> {
    return this.getLinkOrThrow(options?.link).follow<T>(options);
  }

  public getEmbedded<T = Resource>(key: string): T | T[] | null {
    if (!key || !key.length || !this._embedded || !this._embedded[key]) {
      return null;
    }
    if (Array.isArray(this._embedded[key])) {
      return this._embedded[key].map((resource: IResource) => resource);
    }
    return this._embedded[key] as unknown as T;
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
    return this._templates[key] || null;
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

  public affordTemplate<T extends Resource = Resource>(
    options?: AffordanceOptions & { template?: string },
  ): Observable<T> {
    return this.getTemplateOrThrow(options?.template).afford<T>(options);
  }

  public canAfford(options?: { template?: string; body?: any }): boolean {
    return this.getTemplate(options?.template)?.canAfford(options?.body) || false;
  }

  public canAffordProperty(options?: { template?: string; name?: string; value?: any }): boolean {
    return this.getTemplate(options?.template)?.canAffordProperty(options?.name, options?.value) || false;
  }

  public toJson(): IResource {
    return JSON.parse(
      JSON.stringify({
        ...this,
        _links: this.linksToJson(),
        _templates: this.templatesToJson(),
        _embedded: this.embeddedToJson(),
      }),
    );
  }

  private linksToJson(): { [key: string]: ILink | undefined } | undefined {
    return this._links
      ? Object.keys(this._links)
          .map((key) => ({ [key]: this._links![key]?.toJson() }))
          .reduce((previous, current) => ({ ...previous, ...current }), {})
      : undefined;
  }

  private templatesToJson(): { [key: string]: ITemplate | undefined } | undefined {
    return this._templates
      ? Object.keys(this._templates)
          .map((key) => ({ [key]: this._templates![key]?.toJson() }))
          .reduce((previous, current) => ({ ...previous, ...current }), {})
      : undefined;
  }

  private embeddedToJson(): { [key: string]: IResource | IResource[] } | undefined {
    return this._embedded
      ? Object.keys(this._embedded)
          .map((key) => ({
            [key]: Array.isArray(this._embedded![key])
              ? this._embedded![key].map((resource: Resource) => resource.toJson())
              : this._embedded![key] instanceof Resource
              ? (this._embedded![key] as Resource).toJson()
              : JSON.parse(JSON.stringify(this._embedded![key])),
          }))
          .reduce((previous, current) => ({ ...previous, ...current }), {})
      : undefined;
  }
}

export function affordTemplate<T extends Resource = Resource>(
  options?: AffordanceOptions & { template?: string },
): (observable: Observable<Resource>) => Observable<T> {
  return (observable: Observable<Resource>) => {
    return observable.pipe(
      take(1),
      switchMap((resource) => resource.affordTemplate<T>({ ...options })),
    );
  };
}
