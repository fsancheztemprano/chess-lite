import { TestBed } from '@angular/core/testing';
import { stubMessageServiceProvider, stubToasterServiceProvider } from '@app/ui/shared';
import { stubAdministrationServiceProvider } from '../../../services/administration.service.stub';

import { GlobalSettingsService } from './global-settings.service';

describe('GlobalSettingsService', () => {
  let service: GlobalSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubAdministrationServiceProvider, stubMessageServiceProvider, stubToasterServiceProvider],
    });
    service = TestBed.inject(GlobalSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
