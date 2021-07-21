import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chess-lite-administration-sidenav',
  templateUrl: './administration-sidenav.component.html',
  styleUrls: ['./administration-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationSidenavComponent {}
