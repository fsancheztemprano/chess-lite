import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '@chess-lite/domain';
import { tadaAnimation, wobbleAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { fileSizeValidator } from '../../../../../../shared/utils/forms/validators/file-size.validator';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'chess-lite-user-upload-avatar',
  templateUrl: './user-upload-avatar.component.html',
  styleUrls: ['./user-upload-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), tadaAnimation()],
})
export class UserUploadAvatarComponent {
  private readonly _user$: Observable<User> = this.userService.getCurrentUser() as Observable<User>;

  maxSize = 128;

  public readonly form = new FormGroup({
    avatar: new FormControl(null, [fileSizeValidator(this.maxSize * 1024)]),
  });
  submitError = false;
  submitSuccess = false;
  submitSuccessMessage = false;

  submitErrorMessage = false;

  constructor(public readonly userService: UserService, private readonly cdr: ChangeDetectorRef) {}

  get user$(): Observable<User> {
    return this._user$;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit(event: any) {
    if (event?.target?.files && event?.target?.files[0]) {
      this.userService.uploadAvatar(this.user$, event.target.files[0]).subscribe({
        next: () => this.setSubmitStatus(true),
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
