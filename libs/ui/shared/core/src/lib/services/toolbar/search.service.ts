import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, sampleTime } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly _searchTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _showSearchBar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _showSearchInput$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get searchTerm$(): Observable<string> {
    return this._searchTerm$.pipe(distinctUntilChanged(), sampleTime(100));
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm$.next(searchTerm);
  }

  get showSearchBar$(): Observable<boolean> {
    return this._showSearchBar$.asObservable();
  }

  set showSearchBar(showSearchBar: boolean) {
    this._showSearchBar$.next(showSearchBar);
  }

  get showSearchInput$(): Observable<boolean> {
    return this._showSearchInput$.asObservable();
  }

  set showSearchInput(showSearchInput: boolean) {
    this._showSearchInput$.next(showSearchInput);
  }

  toggleShowSearchInput() {
    this.showSearchInput = !this._showSearchInput$.value;
  }

  reset() {
    this.showSearchBar = false;
    this.showSearchInput = false;
    this.searchTerm = '';
  }
}
