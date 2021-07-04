import { HttpClient } from '@angular/common/http';
import { InjectorInstance } from '@chess-lite/hal-form-client';
import { parse } from 'url-template';
import { IResource } from './resource';
import { ContentTypeEnum } from './content-type.enum';
import { Observable, throwError } from 'rxjs';
import { last } from 'rxjs/operators';

export interface ILink {
  href: string;
  templated?: boolean;
  type?: string;
  name?: string;
}

export class Link implements ILink {
  private httpClient: HttpClient = InjectorInstance.get(HttpClient);

  href: string;
  templated?: boolean;
  type?: string;
  name?: string;

  constructor(raw: ILink) {
    this.href = raw.href;
    this.templated = raw.templated;
    this.type = raw.type;
    this.name = raw.name;
  }

  parseUrl(params: any): string | null {
    if (this.templated && !params) {
      return null;
    }
    const template = parse(this.href);
    return template.expand(params);
  }

  get<R = IResource>(params?: any): Observable<R> {
    const url = this.parseUrl(params);
    return url
      ? this.httpClient.get<R>(url, { headers: { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS } }).pipe(last())
      : throwError(() => new Error(`Un-parsable Url ${url}, ${this.href},  ${params}`));
  }
}
