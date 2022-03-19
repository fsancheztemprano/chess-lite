import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuData } from '@app/domain';
import { UserSettingsService } from '../../../services/user-settings.service';

@Component({
  selector: 'app-user-settings-sidenav-item',
  templateUrl: './user-settings-sidenav-item.component.html',
  styleUrls: ['./user-settings-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();
  items: MenuData[] = [
    {
      icon: 'settings_applications',
      title: 'Dashboard',
      link: '/user',
    },
    {
      icon: 'account_box',
      title: 'Profile',
      link: '/user/profile',
      canShow: this.userSettingsService.isAllowedToUpdateProfile(),
    },
    {
      icon: 'account_circle',
      title: 'Upload Avatar',
      link: '/user/avatar',
      canShow: this.userSettingsService.isAllowedToUploadAvatar(),
    },
    {
      icon: 'password',
      title: 'Change Password',
      link: '/user/password',
      canShow: this.userSettingsService.isAllowedToChangePassword(),
    },
    {
      icon: 'delete_forever',
      title: 'Delete Account',
      link: '/user/delete',
      canShow: this.userSettingsService.isAllowedToDeleteAccount(),
    },
    {
      icon: 'manage_accounts',
      title: 'Preferences',
      link: '/user/preferences',
      canShow: this.userSettingsService.hasLinkToUserPreferences(),
    },
  ];

  constructor(public readonly router: Router, public readonly userSettingsService: UserSettingsService) {}
}
