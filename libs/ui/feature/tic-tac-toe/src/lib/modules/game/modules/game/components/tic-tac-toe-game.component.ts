import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/ui/shared/app';
import { TicTacToeGame, TicTacToeGameChangedMessage, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-tic-tac-toe-game',
  templateUrl: './tic-tac-toe-game.component.html',
  styleUrls: ['./tic-tac-toe-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly message = inject(MessageService);
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
  );

  ngOnInit(): void {
    this.message
      .multicast<TicTacToeGameChangedMessage>(this.route.snapshot.data.game.getLink('ws').getParsedUrl())
      .pipe(
        untilDestroyed(this),
        switchMap(() => this.game$.value.getLinkOrThrow().follow()),
        map((game) => new TicTacToeGame(game)),
      )
      .subscribe((game) => this.game$.next(game));
  }
}

interface Cell {
  value: string;
  cell: string;
  canMove: boolean;
  move: () => void;
}
