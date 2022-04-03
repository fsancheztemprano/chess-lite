import { TestBed } from '@angular/core/testing';
import { stubSessionRepositoryProvider, stubSessionServiceProvider } from '@app/ui/shared/app';
import { HalFormClientModule } from '@hal-form-client';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [stubSessionRepositoryProvider, stubSessionServiceProvider],
    });
    service = TestBed.inject(UserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
