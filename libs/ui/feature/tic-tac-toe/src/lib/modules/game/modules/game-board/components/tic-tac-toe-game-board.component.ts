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
            cell.winner = this.isWinnerCell(column, row);
            break;
        }
        return cell;
      });
    }
  }

  private isWinnerCell(column: string, row: number): boolean {
    const splitBoard = this.game?.board?.split('');
    const r = splitBoard?.filter((value, index) => index % 3 === row - 1);
    if (r?.length === 3 && new Set(r).size === 1) {
      return true;
    }
    const c = splitBoard?.filter((value, index) => Math.floor(index / 3) === column.charCodeAt(0) - 65);
    if (c?.length === 3 && new Set(c).size === 1) {
      return true;
    }
    if ((column === 'A' && row === 3) || (column === 'B' && row == 2) || (column === 'C' && row === 1)) {
      const diagonal: string[] =
        splitBoard?.filter((value, index) => index % 2 === 0 && index !== 0 && index !== 8) || [];
      if (diagonal.length === 3 && new Set(diagonal).size === 1) {
        return true;
      }
    }
    if ((column === 'A' && row === 1) || (column === 'B' && row == 2) || (column === 'C' && row === 3)) {
      const diagonal: string[] =
        splitBoard?.filter((value, index) => index % 2 === 0 && index !== 2 && index !== 6) || [];
      if (diagonal.length === 3 && new Set(diagonal).size === 1) {
        return true;
      }
    }
    return false;
  }
}
