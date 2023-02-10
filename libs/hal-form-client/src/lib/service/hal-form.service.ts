import { HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContentType, LinkOptions } from '../domain/domain';
import { Link } from '../domain/link';
import { IResource, Resource } from '../domain/resource';
import { ROOT_RESOURCE_URL } from '../hal-form-client.module';
import { HalFormResourceService } from './hal-form-resource.service';

@Injectable({ providedIn: 'root' })
export class HalFormService extends HalFormResourceService {
  constructor(@Inject(ROOT_RESOURCE_URL) protected _rootUrl = '') {
    super();
  }

  public initialize(): Observable<Resource> {
    return this.fetchRootResource().pipe(
      tap({
        next: (resource: Resource) => this.setResource(resource),
        error: (error) => {
          console.error('Hal Form Service Initialization Error', error);
          this.setResource();
        },
      }),
    );
  }

  public fetchRootResource(options?: LinkOptions): Observable<Resource> {
    return Link.ofHref(this._rootUrl)
      .get<IResource>(options)
      .pipe(
        map((response: HttpResponse<IResource>) => {
          if (!response.headers.get('Content-Type')?.includes(ContentType.APPLICATION_JSON_HAL_FORMS)) {
            console.warn(`Provided url ${this._rootUrl} is not Hal Form Compliant`);
            if (!response.headers.get('Content-Type')?.includes(ContentType.APPLICATION_JSON_HAL)) {
              console.error(`Provided url ${this._rootUrl} is not Hal Compliant`);
            }
          }
          return new Resource(response.body || {});
        }),
      );
  }
}
