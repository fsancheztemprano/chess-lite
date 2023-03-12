import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeGameListFilterService {
  private readonly _filters$: BehaviorSubject<Filters> = new BehaviorSubject<Filters>({});

  get filters$(): Observable<TicTacToeGameListFilters> {
    return this._filters$.asObservable().pipe(
      map((filters: Filters) => {
        const status: string[] = Object.entries(filters.status || {})
          .filter(([, value]) => value)
          .map(([key]) => key);
        return { ...filters, status: status.length ? status : undefined };
      }),
    );
  }

  setFilters(filter: Filters = {}) {
    this._filters$.next(filter);
  }
}

export interface Filters {
  [key: string]: unknown | undefined;
}

export interface TicTacToeGameListFilters extends Filters {
  myGames?: boolean;
  player?: string;
  status?: string[];
}
