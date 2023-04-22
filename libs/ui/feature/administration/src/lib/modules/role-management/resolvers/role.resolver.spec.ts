import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Role } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { stubRoleManagementServiceProvider } from '../services/role-management.service.stub';
import { roleResolver } from './role.resolver';

describe('RoleResolver', () => {
  const resolver = (route: ActivatedRouteSnapshot): Observable<Role> =>
    TestBed.runInInjectionContext(() => roleResolver(route));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [stubRoleManagementServiceProvider],
    });
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
