import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fileSizeValidator } from '@app/ui/shared/common';
import { UserSettingsService } from '@app/ui/shared/core';

@Component({
  selector: 'app-user-upload-avatar',
  templateUrl: './user-upload-avatar.component.html',
  styleUrls: ['./user-upload-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUploadAvatarComponent {
  private readonly maxSize = 128;

  public readonly form = new FormGroup({
    avatar: new FormControl(null, [fileSizeValidator(this.maxSize * 1024)]),
  });

  constructor(public readonly userService: UserSettingsService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit(event: any): void {
    if (event?.target?.files.length && event?.target?.files[0]) {
      this.userService.uploadAvatar(event.target.files[0]).subscribe();
    }
  }
}
