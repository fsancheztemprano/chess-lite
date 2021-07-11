import { TestBed } from '@angular/core/testing';
import { stubUserRootServiceProvider } from '../services/user-root.service.stub';

import { CurrentUserResolver } from './current-user.resolver';

describe('CurrentUserResolver', () => {
  let resolver: CurrentUserResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserRootServiceProvider],
    });
    resolver = TestBed.inject(CurrentUserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
