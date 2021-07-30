import { TestBed } from '@angular/core/testing';
import { stubRoleManagementServiceProvider } from '../services/role-management.service.stub';

import { RolesResolver } from './roles.resolver';

describe('RolesResolver', () => {
  let resolver: RolesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubRoleManagementServiceProvider],
    });
    resolver = TestBed.inject(RolesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
