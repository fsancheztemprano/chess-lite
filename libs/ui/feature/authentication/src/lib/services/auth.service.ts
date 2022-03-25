import { Injectable } from '@angular/core';
import { AuthRelations, LoginInput, SignupInput, User } from '@app/domain';
import { mapSession, Session, SessionService } from '@app/ui/shared';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@hal-form-client';
import { Observable } from 'rxjs';
import { exhaustMap, first, map, switchMap } from 'rxjs/operators';
import { AuthenticationModule } from '../authentication.module';

@Injectable({
  providedIn: AuthenticationModule,
})
export class AuthService {
  constructor(private readonly halFormService: HalFormService, private readonly sessionService: SessionService) {}

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
      map(mapSession),
      exhaustMap((session: Session) => this.sessionService.initialize(session).pipe(map(() => session))),
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
