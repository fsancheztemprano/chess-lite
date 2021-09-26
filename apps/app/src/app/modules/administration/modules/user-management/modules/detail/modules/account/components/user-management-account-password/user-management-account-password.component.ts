import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserManagementRelations } from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';
import { matchingControlsValidators } from '../../../../../../../../../../shared/utils/forms/validators/matching-controls.validator';
import { setTemplateValidators } from '../../../../../../../../../../shared/utils/forms/validators/set-template.validators';
import { UserManagementDetailService } from '../../../../services/user-management-detail.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-account-password',
  templateUrl: './user-management-account-password.component.html',
  styleUrls: ['./user-management-account-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAccountPasswordComponent {
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
    this.userManagementDetailService
      .getUser()
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        setTemplateValidators(this.form, user.getTemplate(UserManagementRelations.USER_UPDATE_REL));
      });
  }

  onSubmit() {
    this.userManagementDetailService.updateProfile(this.form.value).subscribe({
      next: () => {
        this.toasterService.showToast({ message: 'Password updated successfully' });
        this.form.reset();
      },
      error: () => this.toasterService.showToast({ message: 'An error occurred.' }),
    });
  }
}
