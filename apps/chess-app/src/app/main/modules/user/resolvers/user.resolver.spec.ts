import { TestBed } from '@angular/core/testing';
import { stubUserServiceProvider } from '../services/user.service.stub';

import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserServiceProvider],
    });
    resolver = TestBed.inject(UserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
