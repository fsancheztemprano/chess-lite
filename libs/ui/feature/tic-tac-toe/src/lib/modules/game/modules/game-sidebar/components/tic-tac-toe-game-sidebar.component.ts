import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { TicTacToeGameService } from '../../../services/tic-tac-toe-game.service';

@Component({
  selector: 'app-tic-tac-toe-game-sidebar',
  templateUrl: './tic-tac-toe-game-sidebar.component.html',
  styleUrls: ['./tic-tac-toe-game-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicTacToeGameSidebarComponent {
  protected readonly service: TicTacToeGameService = inject(TicTacToeGameService);
}
