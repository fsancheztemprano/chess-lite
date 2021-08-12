import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrentUserRelations, User } from '@app/domain';
import { Observable } from 'rxjs';
import { HeaderService } from '../../../../../../core/services/header.service';
import { ToasterService } from '../../../../../../shared/services/toaster.service';
import { fileSizeValidator } from '../../../../../../shared/utils/forms/validators/file-size.validator';
import { CurrentUserService } from '../../../../services/current-user.service';

@Component({
  selector: 'app-user-upload-avatar',
  templateUrl: './user-upload-avatar.component.html',
  styleUrls: ['./user-upload-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUploadAvatarComponent implements OnDestroy {
  private readonly _user$: Observable<User> = this.userService.getCurrentUser() as Observable<User>;

  maxSize = 128;

  public readonly form = new FormGroup({
    avatar: new FormControl(null, [fileSizeValidator(this.maxSize * 1024)]),
  });

  UPLOAD_AVATAR_REL = CurrentUserRelations.UPLOAD_AVATAR_REL;

  constructor(
    public readonly userService: CurrentUserService,
    private readonly headerService: HeaderService,
    private readonly toasterService: ToasterService,
  ) {
    this.headerService.setHeader({ title: 'User Avatar' });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  get user$(): Observable<User> {
    return this._user$;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit(event: any) {
    if (event?.target?.files && event?.target?.files[0]) {
      this.userService.uploadAvatar(this.user$, event.target.files[0]).subscribe({
        next: () => this.toasterService.showToast({ message: 'Image Uploaded Successfully' }),
        error: () => console.log('Error uploading profile image, max 30kb'),
      });
    }
  }
}
