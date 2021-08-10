import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrentUserRelations, User } from '@chess-lite/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { noop, Observable } from 'rxjs';
import { HeaderService } from '../../../../../../core/services/header.service';
import { ToasterService } from '../../../../../../shared/services/toaster.service';
import { setResourceValidatorsPipe } from '../../../../../../shared/utils/forms/rxjs/set-resource-validators.rxjs.pipe';
import { matchingControlsValidators } from '../../../../../../shared/utils/forms/validators/matching-controls.validator';
import { CurrentUserService } from '../../../../services/current-user.service';

@UntilDestroy()
@Component({
  selector: 'chess-lite-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserChangePasswordComponent implements OnDestroy {
  private readonly _user$: Observable<User> = this.userService.getCurrentUser() as Observable<User>;

  public form = new FormGroup(
    {
      password: new FormControl(''),
      password2: new FormControl(''),
      newPassword: new FormControl(''),
      newPassword2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2'), matchingControlsValidators('newPassword', 'newPassword2')],
  );

  CHANGE_PASSWORD_REL = CurrentUserRelations.CHANGE_PASSWORD_REL;

  constructor(
    public readonly userService: CurrentUserService,
    private readonly toasterService: ToasterService,
    private readonly headerService: HeaderService,
  ) {
    this.user$
      .pipe(untilDestroyed(this), setResourceValidatorsPipe(this.form, CurrentUserRelations.CHANGE_PASSWORD_REL))
      .subscribe();
    this.headerService.setHeader({ title: 'Change Password' });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  get user$(): Observable<User> {
    return this._user$;
  }

  onSubmit() {
    this.userService.changePassword(this.user$, this.form.value).subscribe({
      next: () => this.toasterService.showToast({ title: 'Password Changed Successfully' }),
      error: () => noop,
    });
  }
}
