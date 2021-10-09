import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRelations, HttpHeaders, LoginInput, SignupInput, User } from '@app/domain';
import { HalFormService, IResource, submitToTemplateOrThrowPipe, Template } from '@hal-form-client';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Session, SessionService } from '../../core/services/session.service';
import { AuthModule } from '../auth.module';

@Injectable({
  providedIn: AuthModule,
})
export class AuthService {
  constructor(private readonly halFormService: HalFormService, private readonly sessionService: SessionService) {}

  public getLoginTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.LOGIN_RELATION);
  }

  public isAllowedToLogin(): Observable<boolean> {
    return this.halFormService.isAllowedTo(AuthRelations.LOGIN_RELATION);
  }

  public login(loginInput: LoginInput): Observable<User | null> {
    return this.halFormService.getResource().pipe(
      submitToTemplateOrThrowPipe(AuthRelations.LOGIN_RELATION, loginInput, undefined, 'response'),
      map((response: HttpResponse<IResource>) => {
        const token = response?.headers?.get(HttpHeaders.JWT_TOKEN) || '';
        const user = new User(response.body as IResource);
        return { token, user };
      }),
      switchMap((session: Session) => this.sessionService.initialize(session)),
    );
  }

  public getSignupTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.SIGNUP_RELATION);
  }

  public isAllowedToSignup(): Observable<boolean> {
    return this.halFormService.isAllowedTo(AuthRelations.SIGNUP_RELATION);
  }

  public signup(signupInput: SignupInput): Observable<User | null> {
    return this.halFormService
      .getResource()
      .pipe(submitToTemplateOrThrowPipe(AuthRelations.SIGNUP_RELATION, signupInput));
  }
}
