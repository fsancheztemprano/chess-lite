import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class StubAuthService implements Partial<AuthService> {
  getLoginTemplate = () => of(null);
  getSignupTemplate = () => of(null);
}

export const stubAuthServiceProvider = {
  provide: AuthService,
  useClass: StubAuthService,
};
