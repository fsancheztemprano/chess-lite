import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { Role, RoleManagementRelations, RolePage } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-role',
  templateUrl: './user-management-role.component.html',
  styleUrls: ['./user-management-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementRoleComponent {
  public readonly roles$: Observable<Role[]> = this.route.data.pipe(
    map((data) => data.roles),
    map((rolePage: RolePage) => rolePage.getEmbeddedCollection<Role>(RoleManagementRelations.ROLE_MODEL_LIST_REL)),
    startWith([]),
  );

  public readonly form = new FormGroup({ roleId: new FormControl('') });
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.detail.authority.role';

  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    private readonly route: ActivatedRoute,
    private readonly toasterService: ToasterService,
  ) {
    this.userManagementDetailService.user$
      .pipe(untilDestroyed(this))
      .subscribe((user) => this.form.patchValue({ roleId: user.role?.id }));
  }

  onSubmit() {
    this.userManagementDetailService
      .updateUserRole(this.form.value.roleId!)
      .subscribe(() => this.toasterService.showToast({ message: translate(`${this.TRANSLOCO_SCOPE}.toast.saved`) }));
  }
}
