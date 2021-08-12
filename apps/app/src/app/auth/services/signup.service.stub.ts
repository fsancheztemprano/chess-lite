import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { SignupService } from './signup.service';

@Injectable({ providedIn: 'root' })
export class StubSignupService implements Partial<SignupService> {
  getSignupTemplate = () => of(null);
  canSignup = () => of(true);
}

export const stubSignupServiceProvider = {
  provide: SignupService,
  useClass: StubSignupService,
};
