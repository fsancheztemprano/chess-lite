import { Injectable } from '@angular/core';
import { httpToSession, initialize } from '@app/ui/shared/app';
import { AuthRelations, LoginInput, Session, SignupInput, User } from '@app/ui/shared/domain';
import { affordTemplate, HalFormService, Template } from '@hal-form-client';
import { Actions } from '@ngneat/effects-ng';
import { Observable, tap } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly halFormService: HalFormService, private readonly actions: Actions) {}

  public getLoginTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.LOGIN_RELATION);
  }

  public hasTemplateToLogin(): Observable<boolean> {
    return this.halFormService.hasTemplate(AuthRelations.LOGIN_RELATION);
  }

  public login(body: LoginInput): Observable<Session | null> {
    return this.halFormService.getTemplateOrThrow(AuthRelations.LOGIN_RELATION).pipe(
      first(),
      switchMap((template) => template.request<User>({ body })),
      map(httpToSession),
      tap((session) => this.actions.dispatch(initialize({ session }))),
    );
  }

  public getSignupTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.SIGNUP_RELATION);
  }

  public hasTemplateToSignup(): Observable<boolean> {
    return this.halFormService.hasTemplate(AuthRelations.SIGNUP_RELATION);
  }

  public signup(body: SignupInput): Observable<User | null> {
    return this.halFormService.resource$.pipe(affordTemplate({ template: AuthRelations.SIGNUP_RELATION, body }));
  }
}
