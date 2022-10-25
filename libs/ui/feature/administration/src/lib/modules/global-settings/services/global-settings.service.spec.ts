import { TestBed } from '@angular/core/testing';
import { stubMessageServiceProvider } from '@app/ui/shared/app';
import { stubAdministrationServiceProvider } from '@app/ui/shared/feature/administration';

import { GlobalSettingsService } from './global-settings.service';

describe('GlobalSettingsService', () => {
  let service: GlobalSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubAdministrationServiceProvider, stubMessageServiceProvider],
    });
    service = TestBed.inject(GlobalSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
