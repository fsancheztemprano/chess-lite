import { DataSource } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TicTacToeGame } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatestWith, filter, map, Observable, Subject, switchMap } from 'rxjs';
import { Filters } from '../../../services/tic-tac-toe-game-list-filter.service';

export class TicTacToeGameListDatasource implements DataSource<TicTacToeGame> {
  private readonly _games$: BehaviorSubject<TicTacToeGame[]> = new BehaviorSubject<TicTacToeGame[]>([]);
  private readonly _page$: BehaviorSubject<PageEvent | null> = new BehaviorSubject<PageEvent | null>(null);
  private readonly _sort$: BehaviorSubject<Sort | null> = new BehaviorSubject<Sort | null>(null);
  private readonly _filters$: BehaviorSubject<Filters> = new BehaviorSubject<Filters>({});
  private readonly _refresh$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);
  private readonly _refreshById$: Subject<string> = new Subject<string>();

  constructor(private readonly service: TicTacToeService) {}

  connect(): Observable<TicTacToeGame[]> {
    this._updatePage();
    this._refreshById();
    return this._games$.asObservable();
  }

  private _updatePage() {
    this._refresh$
      .pipe(
        combineLatestWith(this._page$, this._sort$, this._filters$),
        untilDestroyed(this, 'disconnect'),
        switchMap(([, page, sort, filters]) =>
          this.service.getAllGames({
            page: page?.pageIndex ?? 0,
            size: page?.pageSize ?? 10,
            sort: sort ? `${sort.active},${sort.direction}` : undefined,
            ...filters,
          }),
        ),
      )
      .subscribe((games) => this._games$.next(games));
  }

  private _refreshById() {
    this._refreshById$
      .pipe(
        untilDestroyed(this, 'disconnect'),
        filter((id) => this._games$.value.some((game) => game.id === id)),
        switchMap((id) => this.service.getGame(id)),
      )
      .subscribe((game) => {
        const index = this._games$.value.findIndex((g) => g.id === game.id);
        if (index >= 0 && this._games$.value[index].id === game.id) {
          this._games$.value[index] = game;
          this._games$.next(this._games$.value);
        }
      });
  }

  disconnect(): void {
    this._games$.complete();
    this._page$.complete();
    this._sort$.complete();
    this._filters$.complete();
    this._refresh$.complete();
    this._refreshById$.complete();
  }

  get items$(): BehaviorSubject<TicTacToeGame[]> {
    return this._games$;
  }

  get length$(): Observable<number> {
    return this._games$.pipe(map((items) => items.length));
  }

  set page(page: PageEvent) {
    this._page$.next(page);
  }

  set sort(sort: Sort) {
    this._sort$.next(sort);
  }

  set filters(filters: Filters) {
    this._filters$.next(filters);
  }

  refresh() {
    this._refresh$.next();
  }

  refreshById(id: string) {
    this._refreshById$.next(id);
  }
}
