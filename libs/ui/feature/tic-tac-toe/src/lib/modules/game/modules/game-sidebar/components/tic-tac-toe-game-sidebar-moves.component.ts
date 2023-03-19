import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TicTacToeGameService } from '../../../services/tic-tac-toe-game.service';

@Component({
  selector: 'app-tic-tac-toe-game-sidebar-moves',
  templateUrl: './tic-tac-toe-game-sidebar-moves.component.html',
  styleUrls: ['./tic-tac-toe-game-sidebar-moves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameSidebarMovesComponent {
  protected readonly service: TicTacToeGameService = inject(TicTacToeGameService);
}
