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
      icon: 'account_box',
      title$: this.translocoService.selectTranslate('user.home.profile.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.profile.description'),
      route: 'profile',
      canShow: this.userSettingsService.hasTemplateToUpdateProfile(),
    },
    {
      icon: 'account_circle',
      title$: this.translocoService.selectTranslate('user.home.avatar.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.avatar.description'),
      route: 'avatar',
      canShow: this.userSettingsService.hasTemplateToUploadAvatar(),
    },
    {
      icon: 'password',
      title$: this.translocoService.selectTranslate('user.home.password.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.password.description'),
      route: 'password',
      canShow: this.userSettingsService.hasTemplateToChangePassword(),
    },
    {
      icon: 'delete_forever',
      title$: this.translocoService.selectTranslate('user.home.delete.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.delete.description'),
      route: 'delete',
      canShow: this.userSettingsService.hasTemplateToDeleteAccount(),
    },
    {
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('user.home.preferences.title'),
      subtitle$: this.translocoService.selectTranslate('user.home.preferences.description'),
      route: 'preferences',
      canShow: this.userSettingsService.hasLinkToUserPreferences(),
    },
  ];

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly userSettingsService: UserSettingsService,
  ) {}
}
