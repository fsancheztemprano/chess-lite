import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService, TiledMenuTileData } from '@app/ui/shared/core';
import { UserSettingsService } from '../../../../services/user-settings.service';

@Component({
  selector: 'app-user-settings-home',
  templateUrl: './user-settings-home.component.html',
  styleUrls: ['./user-settings-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsHomeComponent implements OnDestroy {
  tiles: TiledMenuTileData[] = [
    {
      icon: 'account_box',
      title: 'User Profile',
      subtitle: 'Edit your profile',
      link: 'profile',
      canShow: this.userSettingsService.isAllowedToUpdateProfile(),
    },
    {
      icon: 'account_circle',
      title: 'Upload Avatar',
      subtitle: 'Change your profile picture',
      link: 'avatar',
      canShow: this.userSettingsService.isAllowedToUploadAvatar(),
    },
    {
      icon: 'password',
      title: 'Change Password',
      subtitle: 'Secure your account',
      link: 'password',
      canShow: this.userSettingsService.isAllowedToChangePassword(),
    },
    {
      icon: 'delete_forever',
      title: 'Delete Account',
      subtitle: 'Remove your account',
      link: 'delete',
      canShow: this.userSettingsService.isAllowedToDeleteAccount(),
    },
    {
      icon: 'manage_accounts',
      title: 'Account Preferences',
      subtitle: 'Modify your application preferences',
      link: 'preferences',
      canShow: this.userSettingsService.hasLinkToUserPreferences(),
    },
  ];

  constructor(private readonly coreService: CoreService, private readonly userSettingsService: UserSettingsService) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
