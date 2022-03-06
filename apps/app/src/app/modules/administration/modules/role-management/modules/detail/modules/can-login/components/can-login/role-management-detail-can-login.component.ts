import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Role, RoleManagementRelations } from '@app/domain';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-role-management-detail-can-login',
  templateUrl: './role-management-detail-can-login.component.html',
  styleUrls: ['./role-management-detail-can-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementDetailCanLoginComponent {
  @Input() role$!: Observable<Role>;
  @Input() showRoleName = false;
  @Input() showCanLoginLabel = false;

  onToggle($event: MatSlideToggleChange) {
    this.role$
      .pipe(
        first(),
        switchMap((role) =>
          role.submitToTemplateOrThrow(RoleManagementRelations.ROLE_UPDATE_REL, { body: { canLogin: $event.checked } }),
        ),
      )
      .subscribe();
  }
}
