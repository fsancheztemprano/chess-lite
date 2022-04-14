import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import * as parser from 'url-template';
import { INJECTOR_INSTANCE } from '../hal-form-client.module';
import { ContentTypeEnum } from './content-type.enum';
import { Resource } from './resource';

export interface ILink {
  href: string;
  templated?: boolean;
  type?: string;
  name?: string;
  headers?: HttpHeaders | { [p: string]: string | string[] };
}

export class Link implements ILink {
  private readonly http: HttpClient = INJECTOR_INSTANCE.get(HttpClient);

  href: string;
  templated?: boolean;
  type?: string;
  name?: string;
  headers?: HttpHeaders | { [p: string]: string | string[] };

  public static of(raw: ILink): Link {
    return new Link(raw);
  }

  public static ofUrl(href: string): Link {
    return new Link({ href });
  }

  constructor(raw: ILink) {
    this.href = raw.href;
    this.templated = raw.templated;
    this.type = raw.type;
    this.name = raw.name;
    this.headers = raw.headers;
  }

  parseUrl(params: any): string | null {
    if (this.templated && !params) {
      return null;
    }
    return parser.parse(this.href).expand(params);
  }

  follow<T extends Resource = Resource>(params?: any): Observable<T> {
    return this.fetch<T>(params).pipe(map((response: HttpResponse<T>) => new Resource(response.body || {}) as T));
  }

  fetch<T>(params?: any): Observable<HttpResponse<T>> {
    const url: string | null = this.parseUrl(params);
    return url
      ? this.http.get<T>(url, {
          headers: { ...{ Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS }, ...(this.headers || {}) },
          observe: 'response',
          responseType: 'json',
        })
      : throwError(() => new Error(`Un-parsable Url ${url}, ${this.href},  ${params}`));
  }
}
