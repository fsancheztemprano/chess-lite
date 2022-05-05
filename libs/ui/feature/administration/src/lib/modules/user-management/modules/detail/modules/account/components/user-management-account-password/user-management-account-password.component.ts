import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToasterService } from '@app/ui/shared/app';
import { matchingControlsValidators, setTemplateValidators } from '@app/ui/shared/common';
import { UserManagementRelations } from '@app/ui/shared/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-account-password',
  templateUrl: './user-management-account-password.component.html',
  styleUrls: ['./user-management-account-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountPasswordComponent {
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.detail.account.password';
  public form = new FormGroup(
    {
      password: new FormControl(''),
      password2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2')],
  );

  constructor(
    public readonly userManagementDetailService: UserManagementDetailService,
    private readonly toasterService: ToasterService,
  ) {
    this.userManagementDetailService.user$
      .pipe(untilDestroyed(this))
      .subscribe((user) => setTemplateValidators(this.form, user.getTemplate(UserManagementRelations.USER_UPDATE_REL)));
  }

  onSubmit() {
    this.userManagementDetailService.updateUser(this.form.value).subscribe(() => {
      this.toasterService.showToast({ message: `${this.TRANSLOCO_SCOPE}.toast.updated` });
      this.form.reset();
    });
  }
}
