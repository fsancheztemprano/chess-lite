import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInput, User } from '@chess-lite/domain';
import { HalFormService, Template } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { notAllowedError } from '../../core/utils/rxjs.utils';
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
    return this.getLoginTemplate().pipe(
      first(),
      switchMap((loginTemplate) => {
        return loginTemplate
          ? loginTemplate.submit(loginInput, null, 'response').pipe(
              this.authService.setLocalSessionPipe(),
              tap(() => this.halFormService.initialize().subscribe()),
            )
          : notAllowedError(this.LOGIN_RELATION);
      }),
    );
  }

  public logout(): void {
    this.authService.clearLocalSession();
  }
}
