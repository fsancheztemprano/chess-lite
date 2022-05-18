import { Injectable } from '@angular/core';
import { noop, of } from 'rxjs';
import { SearchService } from './search.service';

@Injectable({ providedIn: 'root' })
export class StubSearchService implements Partial<SearchService> {
  setSearchTerm = noop;
  getShowSearchBar$ = () => of(true);
  getSearchTerm = () => of('');
}

export const stubSearchServiceProvider = {
  provide: SearchService,
  useClass: StubSearchService,
};
