import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdministrationRelations } from '@chess-lite/domain';
import { HalFormService, Resource } from '@chess-lite/hal-form-client';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdministrationService extends HalFormService {
  constructor(protected readonly httpClient: HttpClient, private readonly halFormService: HalFormService) {
    super(httpClient, '');
  }

  initialize(): Observable<Resource> {
    return this.halFormService.getLink(AdministrationRelations.ADMINISTRATION_REL).pipe(
      switchMap((link) => {
        this._rootUrl = link?.href || '';
        return this._rootUrl?.length
          ? super.initialize()
          : throwError(() => new Error('Administration Initialization Error'));
      }),
    );
  }
}
