import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrentUserRelations } from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HeaderService } from '../../../../../../core/services/header.service';
import { ToasterService } from '../../../../../../shared/services/toaster.service';
import { filterNulls } from '../../../../../../shared/utils/forms/rxjs/filter-null.rxjs.pipe';
import { patchFormPipe } from '../../../../../../shared/utils/forms/rxjs/patch-form.rxjs.pipe';
import { setResourceValidatorsPipe } from '../../../../../../shared/utils/forms/rxjs/set-resource-validators.rxjs.pipe';
import { UserSettingsService } from '../../../../services/user-settings.service';

@UntilDestroy()
@Component({
  selector: 'app-user-update-profile',
  templateUrl: './user-update-profile.component.html',
  styleUrls: ['./user-update-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUpdateProfileComponent implements OnDestroy {
  public form = new FormGroup({
    username: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    profileImageUrl: new FormControl(''),
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

  constructor(
    public readonly userSettingsService: UserSettingsService,
    private readonly headerService: HeaderService,
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
    this.headerService.setHeader({ title: 'User Profile' });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  onSubmit() {
    this.userSettingsService.updateProfile(this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: 'User Profile Saved Successfully' }),
      error: () => this.toasterService.showErrorToast({ message: 'An Error Occurred' }),
    });
  }
}
