import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-administration-home',
  templateUrl: './administration-home.component.html',
  styleUrls: ['./administration-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationHomeComponent {
  tiles: MenuData[] = [
    {
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('administration.home.user-management.title'),
      subtitle$: this.translocoService.selectTranslate('administration.home.user-management.description'),
      route: 'user-management',
      canShow: this.administrationService.hasUserManagementEmbedded(),
    },
    {
      icon: 'military_tech',
      title$: this.translocoService.selectTranslate('administration.home.role-management.title'),
      subtitle$: this.translocoService.selectTranslate('administration.home.role-management.description'),
      route: 'role-management',
      canShow: this.administrationService.hasRoleManagementEmbedded(),
    },
    {
      icon: 'cabin',
      title$: this.translocoService.selectTranslate('administration.home.service-logs.title'),
      subtitle$: this.translocoService.selectTranslate('administration.home.service-logs.description'),
      route: 'service-logs',
      canShow: this.administrationService.hasServiceLogsLink(),
    },
    {
      icon: 'vpn_lock',
      title$: this.translocoService.selectTranslate('administration.home.global-settings.title'),
      subtitle$: this.translocoService.selectTranslate('administration.home.global-settings.description'),
      route: 'global-settings',
      canShow: this.administrationService.hasGlobalSettingsLink(),
    },
  ];

  constructor(
    public readonly administrationService: AdministrationService,
    private readonly translocoService: TranslocoService,
  ) {}
}
