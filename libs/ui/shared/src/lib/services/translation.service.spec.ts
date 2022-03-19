import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '../testing/transloco-testing.module';
import { stubPreferencesServiceProvider } from './preferences.service.stub';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [stubPreferencesServiceProvider],
    });
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
