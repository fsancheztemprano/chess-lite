import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrentUserRelations, User } from '@chess-lite/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tadaAnimation, wobbleAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { patchFormPipe } from '../../../../../../shared/utils/forms/rxjs/patch-form.rxjs.pipe';
import { setResourceValidatorsPipe } from '../../../../../../shared/utils/forms/rxjs/set-resource-validators.rxjs.pipe';
import { CurrentUserService } from '../../../../services/current-user.service';

@UntilDestroy()
@Component({
  selector: 'chess-lite-user-update-profile',
  templateUrl: './user-update-profile.component.html',
  styleUrls: ['./user-update-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), tadaAnimation()],
})
export class UserUpdateProfileComponent {
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

  submitError = false;
  submitSuccess = false;
  submitSuccessMessage = false;
  submitErrorMessage = false;

  UPDATE_PROFILE_REL = CurrentUserRelations.UPDATE_PROFILE_REL;

  constructor(public readonly userService: CurrentUserService, private readonly cdr: ChangeDetectorRef) {
    this.user$
      .pipe(
        untilDestroyed(this),
        patchFormPipe(this.form),
        setResourceValidatorsPipe(this.form, CurrentUserRelations.UPDATE_PROFILE_REL),
      )
      .subscribe();
  }

  get user$(): Observable<User> {
    return this._user$;
  }

  onSubmit() {
    this.userService.updateProfile(this.user$, this.form.value).subscribe({
      next: () => this.setSubmitStatus(true),
      error: () => this.setSubmitStatus(false),
    });
  }

  setSubmitStatus(success: boolean) {
    this.submitSuccess = success;
    this.submitSuccessMessage = success;
    this.submitError = !success;
    this.submitErrorMessage = !success;
    this.cdr.markForCheck();
  }
}
