import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AdministrationRelations, MenuData } from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { HalFormService } from '@hal-form-client';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-administration-sidenav-item',
  templateUrl: './administration-sidenav-item.component.html',
  styleUrls: ['./administration-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationSidenavItemComponent {
  @Output() readonly toggleSidenav = new EventEmitter();

  public readonly items: MenuData[] = [
    {
      id: 'administration-home-menu-item',
      icon: 'space_dashboard',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.dashboard'),
      route: '/administration',
    },
    {
      id: 'user-management-menu-item',
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.user-management'),
      route: ['/administration', 'user-management'],
      visible$: this.administrationService.hasUserManagementEmbedded(),
    },
    {
      id: 'role-management-menu-item',
      icon: 'military_tech',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.role-management'),
      route: ['/administration', 'role-management'],
      visible$: this.administrationService.hasRoleManagementEmbedded(),
    },
    {
      id: 'service-logs-menu-item',
      icon: 'cabin',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.service-logs'),
      route: ['/administration', 'service-logs'],
      visible$: this.administrationService.hasServiceLogsLink(),
    },
    {
      id: 'global-settings-menu-item',
      icon: 'vpn_lock',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.global-settings'),
      route: ['/administration', 'global-settings'],
      visible$: this.administrationService.hasGlobalSettingsLink(),
    },
    {
      id: 'theme-menu-item',
      icon: 'palette',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.theme'),
      route: ['/administration', 'theme'],
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly halFormService: HalFormService,
    private readonly administrationService: AdministrationService,
    private readonly translocoService: TranslocoService,
  ) {}

  public hasAdministrationLink(): Observable<boolean> {
    return this.halFormService.hasLink(AdministrationRelations.ADMINISTRATION_REL);
  }
}
