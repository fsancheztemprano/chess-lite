import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HalFormService, Resource } from '@chess-lite/hal-form-client';
import { iif, Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends HalFormService {
  private readonly USER_MANAGEMENT_REL = 'user-management';

  constructor(
    protected readonly httpClient: HttpClient,
    private readonly administrationService: AdministrationService,
  ) {
    super(httpClient, '');
  }

  initialize(): Observable<Resource> {
    return this.administrationService.rootResource.pipe(
      switchMap((link) => {
        return iif(
          () => link.hasEmbeddedObject(this.USER_MANAGEMENT_REL),
          of(link.getEmbeddedObject(this.USER_MANAGEMENT_REL)),
          throwError(() => new Error('User Management Initialization Error')),
        );
      }),
      tap((resource) => this.setRootResource(resource)),
    );
  }
}
