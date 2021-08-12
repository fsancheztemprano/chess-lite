import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRelations, LoginInput, User } from '@app/domain';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@hal-form-client';
import { Observable, switchMapTo } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private readonly halFormService: HalFormService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  public getLoginTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(AuthRelations.LOGIN_RELATION);
  }

  public isAllowedToLogin(): Observable<boolean> {
    return this.halFormService.isAllowedTo(AuthRelations.LOGIN_RELATION);
  }

  public login(loginInput: LoginInput): Observable<User | null> {
    return this.halFormService.rootResource.pipe(
      submitToTemplateOrThrowPipe(AuthRelations.LOGIN_RELATION, loginInput, undefined, 'response'),
      this.authService.setLocalSessionPipe(),
      switchMapTo(this.halFormService.initialize()),
      switchMapTo(this.authService.fetchCurrentUser()),
    );
  }

  public logout(): void {
    this.authService.clearLocalSession();
  }
}
