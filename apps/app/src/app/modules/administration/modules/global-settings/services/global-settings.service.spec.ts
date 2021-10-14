import { TestBed } from '@angular/core/testing';
import { stubMessageServiceProvider } from '../../../../../core/services/message.service.stub';
import { stubToasterServiceProvider } from '../../../../../core/services/toaster.service.stub';
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
