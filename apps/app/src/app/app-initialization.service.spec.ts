import { TestBed } from '@angular/core/testing';
import { stubSessionServiceProvider } from '@app/ui/shared';
import { HalFormClientModule } from '@hal-form-client';
import { AppInitializationService } from './app-initialization.service';

describe('AppInitializationService', () => {
  let service: AppInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [stubSessionServiceProvider],
    });
    service = TestBed.inject(AppInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
