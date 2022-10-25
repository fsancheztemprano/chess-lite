import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { UserSettingsService } from '@app/ui/shared/core';
import { CurrentUserRelations, MenuData } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-settings-sidenav-item',
  templateUrl: './user-settings-sidenav-item.component.html',
  styleUrls: ['./user-settings-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();

  public readonly items: MenuData[] = [
    {
      id: 'user-settings-home-menu-item',
      icon: 'settings_applications',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.dashboard'),
      route: '/user',
    },
    {
      id: 'user-profile-menu-item',
      icon: 'account_box',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.profile'),
      route: ['/user', 'profile'],
      visible$: this.userSettingsService.hasTemplateToUpdateProfile(),
    },
    {
      id: 'user-avatar-menu-item',
      icon: 'account_circle',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.upload-avatar'),
      route: ['/user', 'avatar'],
      visible$: this.userSettingsService.hasTemplateToUploadAvatar(),
    },
    {
      id: 'user-password-menu-item',
      icon: 'password',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.change-password'),
      route: ['/user', 'password'],
      visible$: this.userSettingsService.hasTemplateToChangePassword(),
    },
    {
      id: 'user-delete-menu-item',
      icon: 'delete_forever',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.delete-account'),
      route: ['/user', 'delete'],
      visible$: this.userSettingsService.hasTemplateToDeleteAccount(),
    },
    {
      id: 'user-preferences-menu-item',
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.preferences'),
      route: ['/user', 'preferences'],
      visible$: this.userSettingsService.hasLinkToUserPreferences(),
    },
  ];

  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly halFormService: HalFormService,
    private readonly translocoService: TranslocoService,
  ) {}

  public hasCurrentUserLink(): Observable<boolean> {
    return this.halFormService.hasLink(CurrentUserRelations.CURRENT_USER_REL);
  }
}
