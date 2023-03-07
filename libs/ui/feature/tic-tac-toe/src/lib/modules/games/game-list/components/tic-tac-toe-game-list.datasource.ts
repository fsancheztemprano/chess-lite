import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { inject, Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TicTacToeGame } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeGameListDatasource implements DataSource<TicTacToeGame> {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly service: TicTacToeService = inject(TicTacToeService);

  private readonly _games: BehaviorSubject<TicTacToeGame[]> = new BehaviorSubject<TicTacToeGame[]>([]);

  public paginator: MatPaginator | undefined;
  public sort: MatSort | undefined;

  get games$(): BehaviorSubject<TicTacToeGame[]> {
    return this._games;
  }

  get length$(): Observable<number> {
    return this._games.pipe(map((games) => games.length));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect(collectionViewer: CollectionViewer): Observable<TicTacToeGame[]> {
    return this.service.getAllGames().pipe(tap(console.log));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disconnect(collectionViewer: CollectionViewer): void {}
}
