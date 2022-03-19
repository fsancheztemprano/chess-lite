import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrentUserRelations } from '@app/domain';
import {
  CardViewHeaderService,
  filterNulls,
  matchingControlsValidators,
  setResourceValidatorsPipe,
  ToasterService,
} from '@app/ui/shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserSettingsService } from '../../../../services/user-settings.service';

@UntilDestroy()
@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserChangePasswordComponent implements OnDestroy {
  public form = new FormGroup(
    {
      password: new FormControl(''),
      password2: new FormControl(''),
      newPassword: new FormControl(''),
      newPassword2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2'), matchingControlsValidators('newPassword', 'newPassword2')],
  );

  constructor(
    public readonly userSettingsService: UserSettingsService,
    private readonly toasterService: ToasterService,
    private readonly headerService: CardViewHeaderService,
  ) {
    this.userSettingsService
      .getCurrentUser()
      .pipe(
        untilDestroyed(this),
        filterNulls(),
        setResourceValidatorsPipe(this.form, CurrentUserRelations.CHANGE_PASSWORD_REL),
      )
      .subscribe();
    this.headerService.setHeader({ title: 'Change Password' });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  onSubmit() {
    this.userSettingsService.changePassword(this.form.value).subscribe({
      next: () => this.toasterService.showToast({ title: 'Password Changed Successfully' }),
      error: () =>
        this.toasterService.showErrorToast({
          title: 'An Error Occurred',
          message: 'Password was not changed.',
        }),
    });
  }
}
