import { MaxSizeValidator } from '@angular-material-components/file-input';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { tadaAnimation, wobbleAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'chess-lite-user-upload-avatar',
  templateUrl: './user-upload-avatar.component.html',
  styleUrls: ['./user-upload-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), tadaAnimation()],
})
export class UserUploadAvatarComponent {
  private _user$: Observable<Resource> = this.route.data.pipe(map(({ user }) => user));

  maxSize = 128;

  public readonly form = new FormGroup({
    avatar: new FormControl(null, [MaxSizeValidator(this.maxSize * 1024)]),
  });

  submitError = false;
  submitSuccess = false;
  submitSuccessMessage = false;
  submitErrorMessage = false;

  constructor(
    public readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get user$(): Observable<Resource> {
    return this._user$;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit(event: any) {
    if (event?.target?.files && event?.target?.files[0]) {
      this.userService.uploadAvatar(this.user$, event.target.files[0]).subscribe({
        next: () => {
          this._user$ = this.userService
            .fetchCurrentUser()
            .pipe(map((user) => (user.as && user.as<Resource>()) || new Resource({})));
          this.setSubmitStatus(true);
        },
        error: () => this.setSubmitStatus(false),
      });
    } else this.setSubmitStatus(false);
  }

  setSubmitStatus(success: boolean) {
    this.submitSuccess = success;
    this.submitSuccessMessage = success;
    this.submitError = !success;
    this.submitErrorMessage = !success;
    this.cdr.markForCheck();
  }
}
