import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe-game-list-sidebar',
  templateUrl: './tic-tac-toe-game-list-sidebar.component.html',
  styleUrls: ['./tic-tac-toe-game-list-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameListSidebarComponent {}
