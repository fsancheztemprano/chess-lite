import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { Role } from '@app/ui/shared/domain';
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
  roles: Observable<Role[]> = this.route.data.pipe(
    startWith({ roles: [] }),
    map((data) => data.roles),
  );

  public form = new FormGroup({ roleId: new FormControl('') });

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
    this.userManagementDetailService.updateUserRole(this.form.value.roleId).subscribe({
      next: () => this.toasterService.showToast({ message: 'Role updated successfully' }),
      error: () => this.toasterService.showToast({ message: 'An error has occurred' }),
    });
  }
}
