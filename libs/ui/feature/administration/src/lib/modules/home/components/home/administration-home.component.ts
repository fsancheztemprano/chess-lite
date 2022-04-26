import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService } from '@app/ui/shared/core';
import { MenuData } from '@app/ui/shared/domain';
import { AdministrationService } from '../../../../services/administration.service';

@Component({
  selector: 'app-administration-home',
  templateUrl: './administration-home.component.html',
  styleUrls: ['./administration-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationHomeComponent implements OnDestroy {
  tiles: MenuData[] = [
    {
      icon: 'manage_accounts',
      title: 'User Management',
      subtitle: 'Manage User Accounts',
      route: 'user-management',
      canShow: this.administrationService.hasUserManagementEmbedded(),
    },
    {
      icon: 'military_tech',
      title: 'Role Management',
      subtitle: 'Manage Roles',
      route: 'role-management',
      canShow: this.administrationService.hasRoleManagementEmbedded(),
    },
    {
      icon: 'cabin',
      title: 'Service Logs',
      subtitle: 'Have a look at the service logs.',
      route: 'service-logs',
      canShow: this.administrationService.hasServiceLogsLink(),
    },
    {
      icon: 'vpn_lock',
      title: 'Global Settings',
      subtitle: 'Global Settings',
      route: 'global-settings',
      canShow: this.administrationService.hasGlobalSettingsLink(),
    },
  ];

  constructor(public readonly administrationService: AdministrationService, private readonly coreService: CoreService) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}
