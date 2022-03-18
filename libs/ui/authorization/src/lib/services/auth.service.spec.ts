import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { stubSessionServiceProvider } from '../../../../../../apps/app/src/app/core/services/session.service.stub';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [stubSessionServiceProvider, AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
