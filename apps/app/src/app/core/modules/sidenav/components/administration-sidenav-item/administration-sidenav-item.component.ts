import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
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
}
