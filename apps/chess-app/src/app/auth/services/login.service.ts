import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRelations, LoginInput, User } from '@chess-lite/domain';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
      tap(() => this.halFormService.initialize().subscribe()),
    );
  }

  public logout(): void {
    this.authService.clearLocalSession();
  }
}
