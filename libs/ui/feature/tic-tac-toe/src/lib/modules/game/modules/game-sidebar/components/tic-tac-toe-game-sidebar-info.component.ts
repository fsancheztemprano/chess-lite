import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TicTacToeGamePlayer, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { TicTacToeGameService } from '../../../services/tic-tac-toe-game.service';

@Component({
  selector: 'app-tic-tac-toe-game-sidebar-info',
  templateUrl: './tic-tac-toe-game-sidebar-info.component.html',
  styleUrls: ['./tic-tac-toe-game-sidebar-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameSidebarInfoComponent {
  protected readonly service: TicTacToeGameService = inject(TicTacToeGameService);
  public readonly TicTacToeGamePlayer = TicTacToeGamePlayer;
  public readonly TicTacToeGameStatus = TicTacToeGameStatus;
}
