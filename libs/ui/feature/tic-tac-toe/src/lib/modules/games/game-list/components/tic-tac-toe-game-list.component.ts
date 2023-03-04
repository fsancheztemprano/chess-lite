import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe-game-list',
  templateUrl: './tic-tac-toe-game-list.component.html',
  styleUrls: ['./tic-tac-toe-game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameListComponent {}
