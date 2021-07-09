import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignupInput, User } from '@chess-lite/domain';
import { HalFormService, Template } from '@chess-lite/hal-form-client';
import { Observable, throwError } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly SIGNUP_RELATION = 'signup';

  constructor(
    private readonly halFormService: HalFormService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  public getSignupTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(this.SIGNUP_RELATION);
  }

  public canSignup(): Observable<boolean> {
    return this.halFormService.isAllowedTo(this.SIGNUP_RELATION);
  }

  public signup(signupInput: SignupInput): Observable<User | null> {
    return this.getSignupTemplate().pipe(
      first(),
      switchMap((signupTemplate) => {
        return signupTemplate
          ? signupTemplate.submit(signupInput, null, 'response').pipe(
              this.authService.setLocalSessionPipe(),
              tap(() => this.halFormService.initialize().subscribe())
            )
          : throwError(() => new Error('Not allowed to signup!'));
      })
    );
  }
}
