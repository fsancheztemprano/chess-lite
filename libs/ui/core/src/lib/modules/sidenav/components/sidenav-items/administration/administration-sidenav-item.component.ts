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
  @Output() toggleSidenav = new EventEmitter();

  items: MenuData[] = [
    {
      icon: 'space_dashboard',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.dashboard'),
      route: '/administration',
    },
    {
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.user-management'),
      route: ['/administration', 'user-management'],
      visible$: this.administrationService.hasUserManagementEmbedded(),
    },
    {
      icon: 'military_tech',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.role-management'),
      route: ['/administration', 'role-management'],
      visible$: this.administrationService.hasRoleManagementEmbedded(),
    },
    {
      icon: 'cabin',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.service-logs'),
      route: ['/administration', 'service-logs'],
      visible$: this.administrationService.hasServiceLogsLink(),
    },
    {
      icon: 'vpn_lock',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.global-settings'),
      route: ['/administration', 'global-settings'],
      visible$: this.administrationService.hasGlobalSettingsLink(),
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
