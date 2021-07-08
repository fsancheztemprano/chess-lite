import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { first, map } from 'rxjs/operators';
import * as parser from 'url-template';
import { InjectorInstance } from '../hal-form-client.module';
import { ContentTypeEnum } from './content-type.enum';
import { IResource, Resource } from './resource';

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
    const template = parser.parse(this.href);
    return template.expand(params);
  }

  get<R = IResource>(params?: any): Observable<R> {
    const url = this.parseUrl(params);
    return url
      ? this.httpClient.get<R>(url, { headers: { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS } }).pipe(
          first(),
          map((response) => new Resource(response).as())
        )
      : throwError(() => new Error(`Un-parsable Url ${url}, ${this.href},  ${params}`));
  }
}
