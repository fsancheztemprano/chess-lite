import { TestBed } from '@angular/core/testing';
import { stubUserManagementDetailServiceProvider } from '../services/user-management-detail.service.stub';

import { UserManagementDetailResolver } from './user-management-detail.resolver';

describe('UserManagementDetailResolver', () => {
  let resolver: UserManagementDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserManagementDetailServiceProvider],
    });
    resolver = TestBed.inject(UserManagementDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
