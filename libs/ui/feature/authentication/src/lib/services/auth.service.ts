import { Injectable } from '@angular/core';
import { httpToSession, initialize } from '@app/ui/shared/app';
import { AuthRelations, LoginInput, Session, SignupInput, User } from '@app/ui/shared/domain';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@hal-form-client';
import { Actions } from '@ngneat/effects-ng';
import { Observable, tap } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AuthenticationModule } from '../authentication.module';

@Injectable({
  providedIn: AuthenticationModule,
})
export class AuthService {
  constructor(private readonly halFormService: HalFormService, private readonly actions: Actions) {}

  public getLoginTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.LOGIN_RELATION);
  }

  public isAllowedToLogin(): Observable<boolean> {
    return this.halFormService.isAllowedTo(AuthRelations.LOGIN_RELATION);
  }

  public login(body: LoginInput): Observable<Session | null> {
    return this.halFormService.getTemplateOrThrow(AuthRelations.LOGIN_RELATION).pipe(
      first(),
      switchMap((template) => template.afford<User>({ body })),
      map(httpToSession),
      tap((session) => this.actions.dispatch(initialize({ session }))),
    );
  }

  public getSignupTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.SIGNUP_RELATION);
  }

  public isAllowedToSignup(): Observable<boolean> {
    return this.halFormService.isAllowedTo(AuthRelations.SIGNUP_RELATION);
  }

  public signup(body: SignupInput): Observable<User | null> {
    return this.halFormService.getResource().pipe(submitToTemplateOrThrowPipe(AuthRelations.SIGNUP_RELATION, { body }));
  }
}
