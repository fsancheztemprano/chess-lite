import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeGameListFilterService {
  private readonly _filter$: BehaviorSubject<Filters> = new BehaviorSubject<Filters>({});

  get filter$(): Observable<Filters> {
    return this._filter$
      .asObservable()
      .pipe(map((filter: Filters) => ({ ...filter, status: filter.status ? Object.keys(filter.status) : undefined })));
  }

  setFilter(filter: Filters = {}) {
    this._filter$.next(filter);
  }
}

export interface Filters {
  [key: string]: unknown | undefined;
}
