import { Injectable } from '@angular/core';
import { MessageService } from '@app/ui/shared/app';
import {
  Pageable,
  PagedList,
  TicTacToeGame,
  TicTacToeGameChangedMessage,
  TicTacToePlayer,
} from '@app/ui/shared/domain';
import { HalFormService, Resource } from '@hal-form-client';
import { map, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeService extends HalFormService {
  constructor(private readonly halFormService: HalFormService, private readonly messageService: MessageService) {
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

  public getAllGames(parameters?: Pageable): Observable<PagedList<TicTacToeGame>> {
    return this.followLink({ link: 'games', parameters: parameters }).pipe(
      map((resource) => ({ list: resource.getEmbeddedCollection('ticTacToeGameModels'), page: resource.page })),
    );
  }

  public getGame(gameId: string): Observable<TicTacToeGame> {
    return this.followLink({
      link: `game`,
      parameters: { gameId },
    }).pipe(map((resource) => new TicTacToeGame(resource)));
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
  }): Observable<TicTacToeGame> {
    return this.affordTemplate<TicTacToeGame>({ template: 'create', body: { ...input } });
  }

  public hasGamesLink(): Observable<boolean> {
    return this.hasLink('games');
  }

  public hasCreateGameTemplate(): Observable<boolean> {
    return this.hasTemplate('create');
  }

  public gamesChangedEvents(): Observable<TicTacToeGameChangedMessage> {
    return this.getLinkOrThrow('ws:games').pipe(
      switchMap((link) => this.messageService.multicast<TicTacToeGameChangedMessage>(link.getParsedUrl())),
    );
  }

  public gamesPlayerChangedEvents(playerId: string): Observable<TicTacToeGameChangedMessage> {
    return this.getLinkOrThrow('ws:game:player').pipe(
      switchMap((link) => this.messageService.multicast<TicTacToeGameChangedMessage>(link.getParsedUrl({ playerId }))),
    );
  }
}
