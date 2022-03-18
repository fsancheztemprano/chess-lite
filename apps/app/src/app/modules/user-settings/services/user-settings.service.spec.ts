import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { stubSessionServiceProvider } from '../../../core/services/session.service.stub';
import { stubUserServiceProvider } from '../../../core/services/user.service.stub';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [stubUserServiceProvider, stubSessionServiceProvider],
    });
    service = TestBed.inject(UserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
