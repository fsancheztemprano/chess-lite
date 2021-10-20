import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _showSearchBar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getSearchTerm(): Observable<string> {
    return this._searchTerm$.asObservable();
  }

  setSearchTerm(searchTerm: string) {
    if (this._searchTerm$.value !== searchTerm) {
      this._searchTerm$.next(searchTerm);
    }
  }

  getShowSearchBar$(): Observable<boolean> {
    return this._showSearchBar$.asObservable();
  }

  setShowSearchBar(showSearchBar: boolean) {
    this._showSearchBar$.next(showSearchBar);
  }

  showSearchBar() {
    this.setShowSearchBar(true);
  }

  hideSearchBar() {
    this.setShowSearchBar(false);
  }

  toggleShowSearchBar() {
    this.setShowSearchBar(!this._showSearchBar$.value);
  }

  reset() {
    this.hideSearchBar();
    this.setSearchTerm('');
  }
}
