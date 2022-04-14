import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  public static ofHref(href: string): Link {
    return new Link({ href });
  }

  constructor(raw: ILink) {
    this.href = raw.href;
    this.templated = raw.templated;
    this.type = raw.type;
    this.name = raw.name;
    this.headers = raw.headers;
  }

  parseHref(parameters?: any): string {
    return parser.parse(this.href).expand(parameters || {});
  }

  follow<T extends Resource = Resource>(parameters?: any): Observable<T> {
    return this.fetch<T>(parameters).pipe(map((response: HttpResponse<T>) => new Resource(response.body || {}) as T));
  }

  fetch<T>(parameters?: any): Observable<HttpResponse<T>> {
    return this.http.get<T>(this.parseHref(parameters) as string, {
      headers: { ...{ Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS }, ...(this.headers || {}) },
      observe: 'response',
      responseType: 'json',
    });
  }
}
