import { Injectable } from '@angular/core';
import { User } from '@app/domain';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class StubAuthService implements Partial<AuthService> {
  isLoggedIn = () => of(true);
  getCurrentUser = () => of({} as User);
}

export const stubAuthServiceProvider = {
  provide: AuthService,
  useClass: StubAuthService,
};
