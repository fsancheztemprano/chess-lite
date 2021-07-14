import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HalFormService, Resource } from '@chess-lite/hal-form-client';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserRootService extends HalFormService {
  constructor(protected readonly httpClient: HttpClient, private readonly halFormService: HalFormService) {
    super(httpClient, '');
  }

  initialize(): Observable<Resource> {
    return this.halFormService.getLink('user-root').pipe(
      switchMap((link) => {
        this._rootUrl = link?.href || '';
        return this._rootUrl?.length
          ? super.initialize()
          : throwError(() => new Error('User Root Initialization Error'));
      }),
    );
  }
}
