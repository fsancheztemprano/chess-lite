import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chess-lite-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {}
