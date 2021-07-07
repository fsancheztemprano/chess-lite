import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { ContentTypeEnum } from '../domain/content-type.enum';
import { catchError, map, tap } from 'rxjs/operators';
import { Resource } from '../domain/resource';
import { ROOT_RESOURCE_URL } from '../hal-form-client.module';

@Injectable({
  providedIn: 'root',
})
export class HalFormService {
  private rootResource!: Resource;

  private loading = false;
  private error = false;

  constructor(private readonly httpClient: HttpClient, @Inject(ROOT_RESOURCE_URL) private readonly root: string) {}

  initialize(): Observable<Resource> {
    this.loading = true;
    return this.httpClient
      .get<Resource>(this.root, {
        headers: { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          this.loading = false;

          if (!response.headers.get('Content-type')?.includes(ContentTypeEnum.APPLICATION_JSON_HAL_FORMS)) {
            console.warn(`Provided url ${this.root} is not Hal Form Compliant`);
            if (!response.headers.get('Content-type')?.includes(ContentTypeEnum.APPLICATION_JSON_HAL)) {
              console.warn(`Provided url ${this.root} is not Hal Compliant`);
            }
          }
        }),
        map((response) => (this.rootResource = response.body || ({} as any))),
        catchError((err) => {
          this.error = true;
          console.error('Hal Form Client Initialization Error', err);
          return EMPTY;
        })
      );
  }
}
