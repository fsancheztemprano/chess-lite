import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('search term', () => {
    it('should set search term', () => {
      expect(service['_searchTerm$'].value).toBe('');

      service.searchTerm = 'test';

      expect(service['_searchTerm$'].value).toBe('test');
    });

    it('should get search term', async () => {
      service.searchTerm = 'test';

      return expect(firstValueFrom(service.searchTerm$)).resolves.toBe('test');
    });

    it('should sample emissions', fakeAsync(() => {
      let emissions = 0;

      service.searchTerm$.subscribe(() => emissions++);

      service.searchTerm = 'test 1';
      tick(50);
      expect(emissions).toBe(0);
      service.searchTerm = 'test 2';
      tick(50);
      expect(emissions).toBe(1);
      service.searchTerm = 'test 3';
      tick(50);
      expect(emissions).toBe(1);
      service.searchTerm = 'test 4';
      tick(50);
      expect(emissions).toBe(2);
      expect(service['_searchTerm$'].value).toBe('test 4');
      discardPeriodicTasks();
    }));

    it('should emit on distinct value', fakeAsync(() => {
      let emissions = 0;

      service.searchTerm$.subscribe(() => emissions++);

      service.searchTerm = 'test 1';
      tick(200);
      expect(emissions).toBe(1);
      service.searchTerm = 'test 1';
      tick(200);
      expect(emissions).toBe(1);
      service.searchTerm = 'test 2';
      tick(200);
      expect(emissions).toBe(2);
      service.searchTerm = 'test 2';
      tick(200);
      expect(emissions).toBe(2);
      expect(service['_searchTerm$'].value).toBe('test 2');
      discardPeriodicTasks();
    }));
  });

  describe('show search', () => {
    it('should set show search', () => {
      expect(service['_showSearchBar$'].value).toBeFalse();

      service.showSearchBar = true;

      expect(service['_showSearchBar$'].value).toBeTrue();
    });

    it('should show search', async () => {
      service.showSearchBar = true;

      return expect(firstValueFrom(service.showSearchBar$)).resolves.toBeTrue();
    });

    it('should hide search', async () => {
      service.showSearchBar = false;

      return expect(firstValueFrom(service.showSearchBar$)).resolves.toBeFalse();
    });
  });

  describe('reset', () => {
    it('should reset search term', () => {
      service.searchTerm = 'test';
      service.showSearchBar = true;

      expect(service['_searchTerm$'].value).toBe('test');
      expect(service['_showSearchBar$'].value).toBeTrue();

      service.reset();

      expect(service['_searchTerm$'].value).toBe('');
      expect(service['_showSearchBar$'].value).toBeFalse();
    });
  });
});
