import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignupInput, User } from '@chess-lite/domain';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly SIGNUP_RELATION = 'signup';

  constructor(
    private readonly halFormService: HalFormService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  public getSignupTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(this.SIGNUP_RELATION);
  }

  public isAllowedToSignup(): Observable<boolean> {
    return this.halFormService.isAllowedTo(this.SIGNUP_RELATION);
  }

  public signup(signupInput: SignupInput): Observable<User | null> {
    return this.halFormService.rootResource.pipe(
      submitToTemplateOrThrowPipe(this.SIGNUP_RELATION, signupInput, undefined, 'response'),
      this.authService.setLocalSessionPipe(),
      tap(() => this.halFormService.initialize().subscribe()),
    );
  }
}
