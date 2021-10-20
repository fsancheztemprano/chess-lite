import { Injectable } from '@angular/core';
import { SearchService } from './search.service';

@Injectable({ providedIn: 'root' })
export class StubSearchService implements Partial<SearchService> {}

export const stubSearchServiceProvider = {
  provide: SearchService,
  useClass: StubSearchService,
};
