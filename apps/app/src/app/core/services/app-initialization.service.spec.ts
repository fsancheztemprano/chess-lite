import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { AppInitializationService } from './app-initialization.service';
import { stubSessionServiceProvider } from './session.service.stub';

describe('AppInitializationService', () => {
  let service: AppInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [stubSessionServiceProvider],
    });
    service = TestBed.inject(AppInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
