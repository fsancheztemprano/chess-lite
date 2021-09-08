import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { stubPreferencesServiceProvider } from '../../core/services/preferences.service.stub';

import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [stubPreferencesServiceProvider],
    });
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
