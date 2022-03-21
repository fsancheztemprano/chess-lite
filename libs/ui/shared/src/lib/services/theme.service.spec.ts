import { TestBed } from '@angular/core/testing';
import { stubPreferencesServiceProvider } from './preferences.service.stub';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubPreferencesServiceProvider],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
