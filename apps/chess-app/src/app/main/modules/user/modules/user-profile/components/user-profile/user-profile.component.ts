import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { tadaAnimation, wobbleAnimation } from 'angular-animations';
import { iif, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { patchFormPipe, setResourceValidatorsPipe } from '../../../../../../../core/utils/form.utils';
import { notAllowedError } from '../../../../../../../core/utils/rxjs.utils';

@Component({
  selector: 'chess-lite-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), tadaAnimation()],
})
export class UserProfileComponent {
  public readonly UPDATE_PROFILE = 'updateProfile';

  private readonly _user$: Observable<Resource> = this.route.data.pipe(map(({ user }) => user));

  public form = new FormGroup({
    username: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    profileImageUrl: new FormControl(''),
    lastLoginDateDisplay: new FormControl({ value: '', disabled: true }),
    joinDate: new FormControl({ value: '', disabled: true }),
    role: new FormControl({ value: '', disabled: true }),
    active: new FormControl({ value: false, disabled: true }),
    locked: new FormControl({ value: false, disabled: true }),
    expired: new FormControl({ value: false, disabled: true }),
    credentialsExpired: new FormControl({ value: false, disabled: true }),
  });

  submitError = false;
  submitSuccess = false;
  submitSuccessMessage = false;
  submitErrorMessage = false;

  constructor(private readonly route: ActivatedRoute, private readonly cdr: ChangeDetectorRef) {
    this.user$.pipe(patchFormPipe(this.form), setResourceValidatorsPipe(this.form, this.UPDATE_PROFILE)).subscribe();
  }

  get user$(): Observable<Resource> {
    return this._user$;
  }

  onSubmit() {
    this.user$
      .pipe(
        switchMap((user) => {
          return iif(
            () => user?.isAllowedTo(this.UPDATE_PROFILE),
            user.getAssuredTemplate(this.UPDATE_PROFILE).submit({
              firstname: this.form.value.firstname,
              lastname: this.form.value.lastname,
              profileImageUrl: this.form.value.profileImageUrl,
            }),
            notAllowedError(this.UPDATE_PROFILE)
          );
        })
      )
      .subscribe({ next: () => this.setSubmitStatus(true), error: () => this.setSubmitStatus(false) });
  }

  setSubmitStatus(success: boolean) {
    this.submitSuccess = success;
    this.submitSuccessMessage = success;
    this.submitError = !success;
    this.submitErrorMessage = !success;
    this.cdr.markForCheck();
  }
}
