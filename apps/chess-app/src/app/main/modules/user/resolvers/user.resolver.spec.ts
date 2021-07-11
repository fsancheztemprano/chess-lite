import { TestBed } from '@angular/core/testing';
import { stubUserRootServiceProvider } from '../services/user-root.service.stub';

import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserRootServiceProvider],
    });
    resolver = TestBed.inject(UserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
