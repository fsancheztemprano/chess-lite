import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubUserManagementServiceProvider } from '../../../services/user-management.service.stub';

import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [stubUserManagementServiceProvider],
    });
    resolver = TestBed.inject(UserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
