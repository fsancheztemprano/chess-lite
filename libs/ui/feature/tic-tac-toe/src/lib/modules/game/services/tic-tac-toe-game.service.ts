import { inject, Injectable } from '@angular/core';
import { MessageService } from '@app/ui/shared/app';
import {
  ITicTacToeGameMove,
  TicTacToeGame,
  TicTacToeGameChangedMessage,
  TicTacToeGameStatus,
} from '@app/ui/shared/domain';
import { Resource } from '@hal-form-client';
import { BehaviorSubject, distinctUntilChanged, iif, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeGameService {
  private readonly message = inject(MessageService);

  private readonly _game$: BehaviorSubject<TicTacToeGame | null> = new BehaviorSubject<TicTacToeGame | null>(null);
  private readonly _moves$: Observable<ITicTacToeGameMove[]> = this._game$.pipe(
    switchMap((game) => game?.getMoves() || []),
    shareReplay(1),
  );
  private readonly _gameUi$: Observable<TicTacToeGame | null> = this._game$.pipe(
    tap((game) => {
      if (game) {
        game.board$ = game.board?.split('').map((value, index) => {
          const row = (index % 3) + 1;
          const column = String.fromCharCode(65 + Math.floor(index / 3));
          return {
            value: value,
            cell: `${column}${row}`,
            canMove:
              game.status === TicTacToeGameStatus.IN_PROGRESS && value === '_' && game.canMove(`${column}${row}`),
            move: () => game.move(`${column}${row}`).subscribe(),
          };
        });
      }
    }),
    shareReplay(1),
  );

  constructor() {
    this._game$
      .pipe(
        distinctUntilChanged(
          (a: TicTacToeGame | null, b: TicTacToeGame | null) =>
            a?.getLink('ws')?.getParsedUrl() === b?.getLink('ws')?.getParsedUrl(),
        ),
        switchMap((game: TicTacToeGame | null) =>
          iif(
            () => !!game,
            this.message.multicast<TicTacToeGameChangedMessage>(game?.getLink('ws')?.getParsedUrl() || '').pipe(
              switchMap(() => game!.getLinkOrThrow().follow()),
              map((updatedGame: Resource) => new TicTacToeGame(updatedGame)),
              tap((updatedGame) => this._game$.next(updatedGame)),
            ),
            of(null),
          ),
        ),
      )
      .subscribe();
  }

  public init(game: TicTacToeGame): Observable<TicTacToeGame | null> {
    this._game$.next(game);
    return this.game$;
  }

  get game$(): Observable<TicTacToeGame | null> {
    return this._gameUi$;
  }

  get moves$(): Observable<ITicTacToeGameMove[]> {
    return this._moves$;
  }

  public teardown(): void {
    this._game$.next(null);
  }
}
