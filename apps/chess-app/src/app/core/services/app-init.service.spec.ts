import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@chess-lite/hal-form-client/testing';
import { stubAuthServiceProvider } from '@ui/auth/stub';
import { AppInitService } from './app-init.service';

describe('AppInitService', () => {
  let service: AppInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [stubAuthServiceProvider],
    });
    service = TestBed.inject(AppInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
