import { ILink, Link } from './link';
import { ITemplate, Template } from './template';
import { Observable } from 'rxjs';
import { HttpMethodEnum } from './http-method.enum';

export interface IResource {
  _links: {
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
}

export class Resource implements IResource {
  _links: {
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
    for (const key of Object.keys(raw._links)) {
      this._links[key] = new Link(raw._links[key]);
    }

    this._embedded = raw._embedded;

    if (raw._templates) {
      this._templates = {} as any;
      for (const key of Object.keys(raw._templates)) {
        if (this._templates) {
          this._templates[key] = new Template(raw._templates[key], this._links.self);
        }
      }
    }
  }

  getLink(key: string = 'self'): Link | null {
    if (!this._links || !this._links[key]) {
      return null;
    }
    return this._links[key];
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

  isAllowedTo(template: string = 'default'): boolean {
    return !!this.getTemplate(template);
  }

  submit(method: HttpMethodEnum, payload: any, params?: any): Observable<any> {
    return new Template({ method }, this._links.self).submit(payload, params);
  }
}
