import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AdministrationService } from '../../services/administration.service';

@Component({
  selector: 'chess-lite-administration-sidenav',
  templateUrl: './administration-sidenav.component.html',
  styleUrls: ['./administration-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationSidenavComponent {
  constructor(private readonly administrationService: AdministrationService) {}

  showUserManagementLink(): Observable<boolean> {
    return this.administrationService.hasEmbeddedObject('user-management');
  }
}
