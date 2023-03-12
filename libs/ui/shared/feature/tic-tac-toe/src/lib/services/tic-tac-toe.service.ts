import { Injectable } from '@angular/core';
import { Pageable, TicTacToeGame, TicTacToePlayer } from '@app/ui/shared/domain';
import { HalFormService, Resource } from '@hal-form-client';
import { map, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeService extends HalFormService {
  constructor(private readonly halFormService: HalFormService) {
    super();
  }

  public override initialize(): Observable<Resource> {
    return this.halFormService.getLink('tic-tac-toe').pipe(
      switchMap((link) => {
        this._rootUrl = link?.href || '';
        return this._rootUrl?.length
          ? super.initialize()
          : throwError(() => new Error('Tic Tac Toe Initialization Error'));
      }),
    );
  }

  public getAllGames(parameters?: Pageable): Observable<TicTacToeGame[]> {
    return this.followLink({ link: 'games', parameters: parameters }).pipe(
      map((resource) => resource.getEmbeddedCollection('ticTacToeGameModels')),
    );
  }

  public getGame(gameId: string): Observable<TicTacToeGame> {
    return this.followLink({ link: `game`, parameters: { gameId } });
  }

  public findPlayers(username?: string): Observable<TicTacToePlayer[]> {
    return this.followLink({
      link: `players`,
      parameters: { username },
    }).pipe(map((resource) => resource.getEmbeddedCollection('ticTacToePlayerModels')));
  }

  public createGame(input?: {
    playerXUsername?: string;
    playerOUsername?: string;
    isPrivate?: boolean;
  }): Observable<unknown> {
    return this.affordTemplate({ template: 'create', body: { ...input } });
  }

  public hasGamesLink(): Observable<boolean> {
    return this.hasLink('games');
  }

  public hasCreateGameTemplate(): Observable<boolean> {
    return this.hasTemplate('create');
  }
}
