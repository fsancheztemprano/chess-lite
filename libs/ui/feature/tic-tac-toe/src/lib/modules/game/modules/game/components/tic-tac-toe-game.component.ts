import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicTacToeGame, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tic-tac-toe-game',
  templateUrl: './tic-tac-toe-game.component.html',
  styleUrls: ['./tic-tac-toe-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected TicTacToeGameStatus = TicTacToeGameStatus;
  protected game$: BehaviorSubject<TicTacToeGame> = new BehaviorSubject<TicTacToeGame>(this.route.snapshot.data.game);
  protected board$: Observable<Cell[] | undefined> = this.game$.pipe(
    map((game) =>
      game.board?.split('').map((value, index) => {
        const row = (index % 3) + 1;
        const column = String.fromCharCode(65 + Math.floor(index / 3));
        return {
          value: value,
          cell: `${column}${row}`,
          canMove: game.status === TicTacToeGameStatus.IN_PROGRESS && value === '_' && game.canMove(`${column}${row}`),
          move: () => game.move(`${column}${row}`).subscribe(),
        };
      }),
    ),
    tap(console.log),
  );

  setStatus(game: TicTacToeGame, status: TicTacToeGameStatus.IN_PROGRESS | TicTacToeGameStatus.REJECTED): void {
    game.changeStatus(status).subscribe();
  }
}

interface Cell {
  value: string;
  cell: string;
  canMove: boolean;
  move: () => void;
}
