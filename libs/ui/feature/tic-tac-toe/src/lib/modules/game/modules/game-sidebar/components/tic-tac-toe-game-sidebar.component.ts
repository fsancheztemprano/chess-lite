import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe-game-sidebar',
  templateUrl: './tic-tac-toe-game-sidebar.component.html',
  styleUrls: ['./tic-tac-toe-game-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameSidebarComponent {}
