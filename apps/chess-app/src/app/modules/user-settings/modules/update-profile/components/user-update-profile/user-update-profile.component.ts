import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrentUserRelations, User } from '@chess-lite/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { noop, Observable } from 'rxjs';
import { HeaderService } from '../../../../../../core/services/header.service';
import { ToasterService } from '../../../../../../shared/services/toaster.service';
import { patchFormPipe } from '../../../../../../shared/utils/forms/rxjs/patch-form.rxjs.pipe';
import { setResourceValidatorsPipe } from '../../../../../../shared/utils/forms/rxjs/set-resource-validators.rxjs.pipe';
import { CurrentUserService } from '../../../../services/current-user.service';

@UntilDestroy()
@Component({
  selector: 'chess-lite-user-update-profile',
  templateUrl: './user-update-profile.component.html',
  styleUrls: ['./user-update-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUpdateProfileComponent implements OnDestroy {
  private readonly _user$: Observable<User> = this.userService.getCurrentUser() as Observable<User>;

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

  UPDATE_PROFILE_REL = CurrentUserRelations.UPDATE_PROFILE_REL;

  constructor(
    public readonly userService: CurrentUserService,
    private readonly headerService: HeaderService,
    private readonly toasterService: ToasterService,
  ) {
    this.user$
      .pipe(
        untilDestroyed(this),
        patchFormPipe(this.form),
        setResourceValidatorsPipe(this.form, CurrentUserRelations.UPDATE_PROFILE_REL),
      )
      .subscribe();
    this.headerService.setHeader({ title: 'User Profile' });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  get user$(): Observable<User> {
    return this._user$;
  }

  onSubmit() {
    this.userService.updateProfile(this.user$, this.form.value).subscribe({
      next: () => this.toasterService.showToast({ message: 'User Profile Saved Successfully' }),
      error: () => noop,
    });
  }
}
