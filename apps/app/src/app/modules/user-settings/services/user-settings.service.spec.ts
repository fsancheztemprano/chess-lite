import { TestBed } from '@angular/core/testing';
import { stubSessionServiceProvider, stubUserServiceProvider } from '@app/ui/shared';
import { HalFormClientModule } from '@hal-form-client';
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
