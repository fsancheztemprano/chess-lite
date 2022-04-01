import { TestBed } from '@angular/core/testing';
import { stubSessionServiceProvider } from '@app/ui/shared/app';
import { AppInitializationService } from './app-initialization.service';

describe('AppInitializationService', () => {
  let service: AppInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubSessionServiceProvider],
    });
    service = TestBed.inject(AppInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
