import { inject, Injectable } from '@angular/core';
import { MessageService } from '@app/ui/shared/app';
import { ITicTacToeGameMove, TicTacToeGame, TicTacToeGameChangedMessage } from '@app/ui/shared/domain';
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
    return this._game$;
  }

  get moves$(): Observable<ITicTacToeGameMove[]> {
    return this._moves$;
  }

  public teardown(): void {
    this._game$.next(null);
  }
}
