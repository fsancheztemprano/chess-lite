import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe-game-list-sidebar',
  templateUrl: './tic-tac-toe-game-list-sidebar.component.html',
  styleUrls: ['./tic-tac-toe-game-list-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicTacToeGameListSidebarComponent {}
