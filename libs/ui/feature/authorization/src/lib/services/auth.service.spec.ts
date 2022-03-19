import { TestBed } from '@angular/core/testing';
import { stubSessionServiceProvider } from '@app/ui/shared';
import { HalFormClientModule } from '@hal-form-client';
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
