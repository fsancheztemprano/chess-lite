import { Injectable } from '@angular/core';
import { Authority, AuthorityManagementRelations } from '@app/domain';
import { Link } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { UserManagementService } from '../../user-management/services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorityManagementService {
  constructor(private readonly userManagementService: UserManagementService) {}

  public getAllAuthorities(): Observable<Authority[]> {
    return this.userManagementService.getLinkOrThrow(AuthorityManagementRelations.AUTHORITIES_REL).pipe(
      first(),
      switchMap((link: Link) =>
        link
          .get({ size: 1000 })
          .pipe(
            map((resource) =>
              resource.getEmbeddedCollection<Authority>(AuthorityManagementRelations.AUTHORITY_MODEL_LIST_REL),
            ),
          ),
      ),
    );
  }
}
