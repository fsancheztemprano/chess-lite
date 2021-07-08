import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class StubAuthService implements Partial<AuthService> {
  getLoginTemplate = () => of(null);
  canLogin = () => of(true);
  isLoggedIn = () => of(true);
}

export const stubStubAuthServiceProvider = {
  provide: AuthService,
  useClass: StubAuthService,
};
