import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRelations, SignupInput, User } from '@app/domain';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@hal-form-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor(
    private readonly halFormService: HalFormService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  public getSignupTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.SIGNUP_RELATION);
  }

  public isAllowedToSignup(): Observable<boolean> {
    return this.halFormService.isAllowedTo(AuthRelations.SIGNUP_RELATION);
  }

  public signup(signupInput: SignupInput): Observable<User | null> {
    return this.halFormService.rootResource.pipe(
      submitToTemplateOrThrowPipe(AuthRelations.SIGNUP_RELATION, signupInput),
    );
  }
}
