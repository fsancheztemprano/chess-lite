import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filterNulls, ToasterService } from '@app/ui/shared/app';
import { matchingControlsValidators, setResourceValidatorsPipe } from '@app/ui/shared/common';
import { UserSettingsService } from '@app/ui/shared/core';
import { CurrentUserRelations } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserChangePasswordComponent {
  public form = new FormGroup(
    {
      password: new FormControl(''),
      password2: new FormControl(''),
      newPassword: new FormControl(''),
      newPassword2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2'), matchingControlsValidators('newPassword', 'newPassword2')],
  );

  public readonly TRANSLOCO_SCOPE = 'user.change-password';

  constructor(
    public readonly userSettingsService: UserSettingsService,
    private readonly toasterService: ToasterService,
  ) {
    this.userSettingsService
      .getCurrentUser()
      .pipe(
        untilDestroyed(this),
        filterNulls(),
        setResourceValidatorsPipe(this.form, CurrentUserRelations.CHANGE_PASSWORD_REL),
      )
      .subscribe();
  }

  onSubmit() {
    this.userSettingsService.changePassword(this.form.value).subscribe({
      next: () => this.toasterService.showToast({ title: translate('user.change-password.toast.success') }),
    });
  }
}
