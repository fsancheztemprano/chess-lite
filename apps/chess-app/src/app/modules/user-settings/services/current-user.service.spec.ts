import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@chess-lite/hal-form-client/testing';
import { stubAuthServiceProvider } from '../../../auth/services/auth.service.stub';

import { CurrentUserService } from './current-user.service';

describe('CurrentUserServiceService', () => {
  let service: CurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [stubAuthServiceProvider],
    });
    service = TestBed.inject(CurrentUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
