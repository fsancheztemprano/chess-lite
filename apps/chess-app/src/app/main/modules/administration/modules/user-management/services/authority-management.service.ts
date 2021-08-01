import { Injectable } from '@angular/core';
import { Authority } from '@chess-lite/domain';
import { Link, noLinkError } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorityManagementService {
  private readonly AUTHORITIES_REL = 'authorities';
  private readonly AUTHORITY_MODEL_LIST_REL = 'authorityModelList';

  constructor(private readonly userManagementService: UserManagementService) {}

  public getAllAuthorities(): Observable<Authority[]> {
    return this.userManagementService.getLink('authorities').pipe(
      first(),
      switchMap((link: Link | null) =>
        link
          ? link
              .get({ size: 1000 })
              .pipe(map((resource) => resource.getEmbeddedCollection(this.AUTHORITY_MODEL_LIST_REL)))
          : noLinkError(this.AUTHORITIES_REL),
      ),
    );
  }
}
