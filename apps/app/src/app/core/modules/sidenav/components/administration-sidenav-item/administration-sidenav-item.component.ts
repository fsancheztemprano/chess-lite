import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceLogsRelations, UserManagementRelations } from '@app/domain';
import { Observable } from 'rxjs';
import { AdministrationService } from '../../../../../modules/administration/services/administration.service';

@Component({
  selector: 'app-administration-sidenav-item',
  templateUrl: './administration-sidenav-item.component.html',
  styleUrls: ['./administration-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();

  constructor(public readonly router: Router, public readonly administrationService: AdministrationService) {}

  hasUserManagementEmbedded(): Observable<boolean> {
    return this.administrationService.hasEmbeddedObject(UserManagementRelations.USER_MANAGEMENT_REL);
  }

  hasServiceLogsLink(): Observable<boolean> {
    return this.administrationService.hasLink(ServiceLogsRelations.SERVICE_LOGS_REL);
  }
}
