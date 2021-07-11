import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chess-lite-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSidenavComponent {}
