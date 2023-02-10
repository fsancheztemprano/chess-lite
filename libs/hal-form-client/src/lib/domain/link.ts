import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP_CLIENT } from '../hal-form-client.module';
import { parseHeaders } from '../utils/headers.utils';
import { parseUrl } from '../utils/url-template.utils';
import { ContentType, LinkOptions } from './domain';
import { Resource } from './resource';

export interface ILink {
  href?: string;
  templated?: boolean;
  name?: string;
}

export class Link implements ILink {
  public href: string;
  public templated?: boolean;
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
      this.name = iLink.name;
    }
  }

  public follow<T extends Resource = Resource>(options?: LinkOptions): Observable<T> {
    return this.followRaw<T>(options).pipe(map((iResource: T) => new Resource(iResource || {}) as T));
  }

  public followRaw<T>(options?: LinkOptions): Observable<T> {
    return this.get<T>(options).pipe(map((response: HttpResponse<T>) => response?.body as T));
  }

  public get<T>(options?: LinkOptions): Observable<HttpResponse<T>> {
    return HTTP_CLIENT.get<T>(parseUrl(this.href, options?.parameters), {
      headers: { Accept: ContentType.APPLICATION_JSON_HAL_FORMS, ...parseHeaders(options?.headers) },
      context: options?.context,
      observe: 'response',
      responseType: 'json',
    });
  }

  public toJson(): ILink {
    return JSON.parse(JSON.stringify({ ...this }));
  }
}
