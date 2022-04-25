import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AdministrationRelations, MenuData } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { AdministrationService } from '../../../services/administration.service';

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
      link: '/administration',
    },
    {
      icon: 'manage_accounts',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.user-management'),
      link: '/administration/user-management',
      canShow: this.administrationService.hasUserManagementEmbedded(),
    },
    {
      icon: 'military_tech',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.role-management'),
      link: '/administration/role-management',
      canShow: this.administrationService.hasRoleManagementEmbedded(),
    },
    {
      icon: 'cabin',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.service-logs'),
      link: '/administration/service-logs',
      canShow: this.administrationService.hasServiceLogsLink(),
    },
    {
      icon: 'vpn_lock',
      title$: this.translocoService.selectTranslate('core.sidenav.administration.subtitle.global-settings'),
      link: '/administration/global-settings',
      canShow: this.administrationService.hasGlobalSettingsLink(),
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
