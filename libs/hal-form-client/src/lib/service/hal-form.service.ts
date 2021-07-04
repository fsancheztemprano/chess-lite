import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ROOT_RESOURCE_URL } from '@chess-lite/hal-form-client';
import { Observable, throwError } from 'rxjs';
import { ContentTypeEnum } from '../domain/content-type.enum';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HalFormService {
  constructor(private readonly httpClient: HttpClient, @Inject(ROOT_RESOURCE_URL) private readonly root: string) {}

  initialize(): Observable<HttpResponse<any>> {
    return this.httpClient
      .get(this.root, { headers: { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS }, observe: 'response' })
      .pipe(
        tap((response) => {
          if (response.headers.get('Content-type')?.includes(ContentTypeEnum.APPLICATION_JSON_HAL_FORMS)) {
            console.warn(`Provided url ${this.root} is not Hal Form Compliant`);
          }
        }),
        catchError((err) => {
          console.error('Hal Form Client Initialization Error', err);
          return throwError(() => err);
        })
      );
  }
}
