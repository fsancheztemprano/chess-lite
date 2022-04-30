import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filterNulls, ToasterService } from '@app/ui/shared/app';
import { patchFormPipe, setResourceValidatorsPipe } from '@app/ui/shared/common';
import { UserSettingsService } from '@app/ui/shared/core';
import { CurrentUserRelations } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-user-update-profile',
  templateUrl: './user-update-profile.component.html',
  styleUrls: ['./user-update-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUpdateProfileComponent {
  public form = new FormGroup({
    username: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    lastLoginDateDisplay: new FormControl({ value: '', disabled: true }),
    joinDate: new FormControl({ value: '', disabled: true }),
    role: new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      name: new FormControl({ value: '', disabled: true }),
    }),
    active: new FormControl({ value: false, disabled: true }),
    locked: new FormControl({ value: false, disabled: true }),
    expired: new FormControl({ value: false, disabled: true }),
    credentialsExpired: new FormControl({ value: false, disabled: true }),
  });
  public readonly TRANSLOCO_SCOPE = 'user.profile';

  constructor(
    public readonly userSettingsService: UserSettingsService,
    private readonly toasterService: ToasterService,
  ) {
    this.userSettingsService
      .getCurrentUser()
      .pipe(
        untilDestroyed(this),
        filterNulls(),
        patchFormPipe(this.form),
        setResourceValidatorsPipe(this.form, CurrentUserRelations.UPDATE_PROFILE_REL),
      )
      .subscribe();
  }

  onSubmit() {
    this.userSettingsService.updateProfile(this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: translate('user.profile.toast.success') }),
    });
  }
}
