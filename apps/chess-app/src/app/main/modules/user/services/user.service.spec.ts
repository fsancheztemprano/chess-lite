import { TestBed } from '@angular/core/testing';
import { stubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';
import { stubAuthServiceProvider } from '../../../../auth/services/auth.service.stub';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubHalFormServiceProvider, stubAuthServiceProvider],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
