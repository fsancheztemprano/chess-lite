import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CurrentUserRelations, MenuData } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { UserSettingsService } from '../../../services/user-settings.service';

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
      icon: 'settings_applications',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.dashboard'),
      route: '/user',
    },
    {
      icon: 'account_box',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.profile'),
      route: '/user/profile',
      canShow: this.userSettingsService.hasTemplateToUpdateProfile(),
    },
    {
      icon: 'account_circle',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.upload-avatar'),
      route: '/user/avatar',
      canShow: this.userSettingsService.hasTemplateToUploadAvatar(),
    },
    {
      icon: 'password',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.change-password'),
      route: '/user/password',
      canShow: this.userSettingsService.hasTemplateToChangePassword(),
    },
    {
      icon: 'delete_forever',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.delete-account'),
      route: '/user/delete',
      canShow: this.userSettingsService.hasTemplateToDeleteAccount(),
    },
    {
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('core.sidenav.user-settings.subtitle.preferences'),
      route: '/user/preferences',
      canShow: this.userSettingsService.hasLinkToUserPreferences(),
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
