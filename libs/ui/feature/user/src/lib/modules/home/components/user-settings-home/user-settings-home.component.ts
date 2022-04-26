import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService } from '@app/ui/shared/core';
import { MenuData } from '@app/ui/shared/domain';
import { UserSettingsService } from '../../../../services/user-settings.service';

@Component({
  selector: 'app-user-settings-home',
  templateUrl: './user-settings-home.component.html',
  styleUrls: ['./user-settings-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsHomeComponent implements OnDestroy {
  tiles: MenuData[] = [
    {
      icon: 'account_box',
      title: 'User Profile',
      subtitle: 'Edit your profile',
      route: 'profile',
      canShow: this.userSettingsService.hasTemplateToUpdateProfile(),
    },
    {
      icon: 'account_circle',
      title: 'Upload Avatar',
      subtitle: 'Change your profile picture',
      route: 'avatar',
      canShow: this.userSettingsService.hasTemplateToUploadAvatar(),
    },
    {
      icon: 'password',
      title: 'Change Password',
      subtitle: 'Secure your account',
      route: 'password',
      canShow: this.userSettingsService.hasTemplateToChangePassword(),
    },
    {
      icon: 'delete_forever',
      title: 'Delete Account',
      subtitle: 'Remove your account',
      route: 'delete',
      canShow: this.userSettingsService.hasTemplateToDeleteAccount(),
    },
    {
      icon: 'manage_accounts',
      title: 'Account Preferences',
      subtitle: 'Modify your application preferences',
      route: 'preferences',
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
