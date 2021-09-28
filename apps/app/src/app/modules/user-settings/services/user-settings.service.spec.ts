import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { stubAuthServiceProvider } from '../../../auth/services/auth.service.stub';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [stubAuthServiceProvider],
    });
    service = TestBed.inject(UserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
