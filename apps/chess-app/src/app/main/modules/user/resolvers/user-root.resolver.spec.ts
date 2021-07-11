import { TestBed } from '@angular/core/testing';
import { stubUserRootServiceProvider } from '../services/user-root.service.stub';

import { UserRootResolver } from './user-root.resolver';

describe('UserRootResolver', () => {
  let resolver: UserRootResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserRootServiceProvider],
    });
    resolver = TestBed.inject(UserRootResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
