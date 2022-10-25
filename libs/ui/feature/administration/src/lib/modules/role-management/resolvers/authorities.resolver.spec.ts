import { TestBed } from '@angular/core/testing';
import { stubAuthorityManagementServiceProvider } from '../services/authority-management.service.stub';
import { AuthoritiesResolver } from './authorities.resolver';

describe('AuthoritiesResolver', () => {
  let resolver: AuthoritiesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubAuthorityManagementServiceProvider],
    });
    resolver = TestBed.inject(AuthoritiesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
