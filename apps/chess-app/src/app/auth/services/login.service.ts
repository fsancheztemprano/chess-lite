import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInput, User } from '@chess-lite/domain';
import { HalFormService, submitToTemplateOrThrowPipe, Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly LOGIN_RELATION = 'login';

  constructor(
    private readonly halFormService: HalFormService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  public getLoginTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(this.LOGIN_RELATION);
  }

  public isAllowedToLogin(): Observable<boolean> {
    return this.halFormService.isAllowedTo(this.LOGIN_RELATION);
  }

  public login(loginInput: LoginInput): Observable<User | null> {
    return this.halFormService.rootResource.pipe(
      submitToTemplateOrThrowPipe(this.LOGIN_RELATION, loginInput, undefined, 'response'),
      this.authService.setLocalSessionPipe(),
      tap(() => this.halFormService.initialize().subscribe()),
    );
  }

  public logout(): void {
    this.authService.clearLocalSession();
  }
}
