import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { first, map } from 'rxjs/operators';
import * as parser from 'url-template';
import { InjectorInstance } from '../hal-form-client.module';
import { ContentTypeEnum } from './content-type.enum';
import { Resource } from './resource';

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

  get<T extends Resource = Resource>(params?: any): Observable<T> {
    const url = this.parseUrl(params);
    return url
      ? this.httpClient.get<T>(url, { headers: { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS } }).pipe(
          first(),
          map((res: T) => new Resource(res || {}) as T),
        )
      : throwError(() => new Error(`Un-parsable Url ${url}, ${this.href},  ${params}`));
  }
}
