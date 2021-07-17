import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { tadaAnimation, wobbleAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { setResourceValidatorsPipe } from '../../../../../../../core/utils/forms/rxjs/set-resource-validators.rxjs.pipe';
import { matchingControlsValidators } from '../../../../../../../core/utils/forms/validators/matching-controls.validator';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'chess-lite-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), tadaAnimation()],
})
export class UserChangePasswordComponent {
  private readonly _user$: Observable<Resource> = this.route.data.pipe(map(({ user }) => user));

  public form = new FormGroup(
    {
      password: new FormControl(''),
      password2: new FormControl(''),
      newPassword: new FormControl(''),
      newPassword2: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2'), matchingControlsValidators('newPassword', 'newPassword2')],
  );

  submitError = false;
  submitSuccess = false;
  submitSuccessMessage = false;
  submitErrorMessage = false;

  constructor(
    public readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.user$.pipe(setResourceValidatorsPipe(this.form, this.userService.CHANGE_PASSWORD_REL)).subscribe();
  }

  get user$(): Observable<Resource> {
    return this._user$;
  }

  onSubmit() {
    this.userService.changePassword(this.user$, this.form.value).subscribe({
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
