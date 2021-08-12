import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class StubLoginService implements Partial<LoginService> {
  getLoginTemplate = () => of(null);
  canLogin = () => of(true);
  isLoggedIn = () => of(true);
}

export const stubLoginServiceProvider = {
  provide: LoginService,
  useClass: StubLoginService,
};
