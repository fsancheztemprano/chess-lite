import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserSettingsService } from '@app/ui/shared/core';
import { MenuData } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-settings-home',
  templateUrl: './user-settings-home.component.html',
  styleUrls: ['./user-settings-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsHomeComponent {
  tiles: MenuData[] = [
    {
      id: 'user-profile-tile',
      icon: 'account_box',
      title$: this.translocoService.selectTranslate('user.home.profile.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.profile.description'),
      route: 'profile',
      visible$: this.userSettingsService.hasTemplateToUpdateProfile(),
    },
    {
      id: 'user-avatar-tile',
      icon: 'account_circle',
      title$: this.translocoService.selectTranslate('user.home.avatar.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.avatar.description'),
      route: 'avatar',
      visible$: this.userSettingsService.hasTemplateToUploadAvatar(),
    },
    {
      id: 'user-password-tile',
      icon: 'password',
      title$: this.translocoService.selectTranslate('user.home.password.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.password.description'),
      route: 'password',
      visible$: this.userSettingsService.hasTemplateToChangePassword(),
    },
    {
      id: 'user-remove-tile',
      icon: 'delete_forever',
      title$: this.translocoService.selectTranslate('user.home.delete.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.delete.description'),
      route: 'delete',
      visible$: this.userSettingsService.hasTemplateToDeleteAccount(),
    },
    {
      id: 'user-preferences-tile',
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('user.home.preferences.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.preferences.description'),
      route: 'preferences',
      visible$: this.userSettingsService.hasLinkToUserPreferences(),
    },
  ];

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly userSettingsService: UserSettingsService,
  ) {}
}
