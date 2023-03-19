import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IsMobileModule } from '@app/ui/shared/core';
import { TicTacToeGame, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { ResizableMatIconDirective } from '../directives/resizable-mat-icon.directive';

export interface TicTacToeGameCell {
  id: string;
  value: string;
  canMove?: boolean;
  move?: () => void;
  winner?: boolean;
  looser?: boolean;
}

@Component({
  selector: 'app-tic-tac-toe-game-board',
  standalone: true,
  imports: [CommonModule, IsMobileModule, ResizableMatIconDirective, MatIconModule],
  templateUrl: './tic-tac-toe-game-board.component.html',
  styleUrls: ['./tic-tac-toe-game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameBoardComponent implements OnChanges {
  @Input() board?: string;
  @Input() highlight?: string;
  @Input() game?: TicTacToeGame;
  protected readonly TicTacToeGameStatus = TicTacToeGameStatus;
  protected cells: TicTacToeGameCell[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.board?.currentValue === 'string') {
      this.cells = changes.board.currentValue.split('').map((value, index) => {
        const row = (index % 3) + 1;
        const column = String.fromCharCode(65 + Math.floor(index / 3));
        const cell = {} as TicTacToeGameCell;
        cell.id = `${column}${row}`;
        cell.value = value;
        switch (this.game?.status) {
          case TicTacToeGameStatus.IN_PROGRESS:
            cell.canMove = value === '_' && this.game.canMove(cell.id);
            cell.move = () => this.game!.move(cell.id).subscribe();
            break;
          case TicTacToeGameStatus.FINISHED:
            cell.looser = cell.value !== this.game.turn;
            cell.winner = cell.value === this.game.turn;
            break;
        }
        return cell;
      });
    }
  }
}
