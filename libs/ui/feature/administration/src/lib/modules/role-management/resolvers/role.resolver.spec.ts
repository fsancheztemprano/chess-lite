import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubRoleManagementServiceProvider } from '../services/role-management.service.stub';

import { RoleResolver } from './role.resolver';

describe('RoleResolver', () => {
  let resolver: RoleResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [stubRoleManagementServiceProvider],
    });
    resolver = TestBed.inject(RoleResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
