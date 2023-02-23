import { Injectable } from '@angular/core';
import { TicTacToeGame } from '@app/ui/shared/domain';
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

  public getAllGames(): Observable<TicTacToeGame[]> {
    return this.followLink({ link: 'games' }).pipe(
      map((resource) => resource.getEmbeddedCollection('ticTacToeGameModelList')),
    );
  }

  public getGame(gameId: string): Observable<TicTacToeGame> {
    return this.followLink({ link: `game`, parameters: { gameId } });
  }

  public getMyGames(): Observable<TicTacToeGame[]> {
    return this.followLink({ link: 'my-games' }).pipe(
      map((resource) => resource.getEmbeddedCollection('ticTacToeGameModelList')),
    );
  }

  public createGame(xId: string, oId: string, pri?: boolean): Observable<unknown> {
    return this.affordTemplate({ template: 'create', body: { xId, oId, private: !!pri } });
  }
}
