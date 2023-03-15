import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe-game-sidebar',
  templateUrl: './tic-tac-toe-game-sidebar.component.html',
  styleUrls: ['./tic-tac-toe-game-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicTacToeGameSidebarComponent {}
