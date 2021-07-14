import { TestBed } from '@angular/core/testing';
import { stubUserServiceProvider } from '../services/user.service.stub';

import { CurrentUserResolver } from './current-user.resolver';

describe('CurrentUserResolver', () => {
  let resolver: CurrentUserResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserServiceProvider],
    });
    resolver = TestBed.inject(CurrentUserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
