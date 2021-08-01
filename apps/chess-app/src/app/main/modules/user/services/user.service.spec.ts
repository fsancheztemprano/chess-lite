import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@chess-lite/hal-form-client/testing';
import { stubAuthServiceProvider } from '@ui/auth/stub';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [stubAuthServiceProvider],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
