import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INJECTOR_INSTANCE } from '../hal-form-client.module';
import { parseUrl } from '../utils/url-template.utils';
import { ContentType, LinkOptions } from './domain';
import { Resource } from './resource';

export interface ILink {
  href?: string;
  templated?: boolean;
  type?: string;
  name?: string;
}

export class Link implements ILink {
  private readonly http: HttpClient = INJECTOR_INSTANCE.get(HttpClient);

  public href: string;
  public templated?: boolean;
  public type?: string;
  public name?: string;

  public static of(iLink?: ILink): Link {
    return new Link(iLink);
  }

  public static ofHref(href?: string): Link {
    return new Link({ href });
  }

  constructor(iLink?: ILink) {
    this.href = iLink?.href || '';
    if (iLink) {
      this.templated = iLink.templated;
      this.type = iLink.type;
      this.name = iLink.name;
    }
  }

  public follow<T extends Resource = Resource>(options?: LinkOptions): Observable<T> {
    return this.fetch<T>(options).pipe(map((response: HttpResponse<T>) => new Resource(response.body || {}) as T));
  }

  public fetch<T>(options?: LinkOptions): Observable<HttpResponse<T>> {
    return this.http.get<T>(parseUrl(this.href, options?.parameters), {
      headers: { ...{ Accept: ContentType.APPLICATION_JSON_HAL_FORMS }, ...(options?.headers || {}) },
      context: options?.context,
      observe: 'response',
      responseType: 'json',
    });
  }

  public toJson(): ILink {
    return JSON.parse(JSON.stringify({ ...this, http: undefined }));
  }
}
