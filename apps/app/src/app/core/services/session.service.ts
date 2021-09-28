import { Injectable } from '@angular/core';
import { TOKEN_KEY, User } from '@app/domain';
import { HalFormService, Resource } from '@hal-form-client';
import { EMPTY, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { isTokenExpired } from '../../auth/utils/auth.utils';
import { MessageService } from './message.service';
import { UserService } from './user.service';

export interface Session {
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(
    private readonly messageService: MessageService,
    private readonly halFormService: HalFormService,
    private readonly userService: UserService,
  ) {
    if (isTokenExpired(localStorage.getItem(TOKEN_KEY))) {
      this._removeToken();
    }
  }

  public initialize(options?: Session): Observable<User> {
    const userToken = options?.token || localStorage.getItem(TOKEN_KEY);
    if (userToken && this._validateToken(userToken)) {
      localStorage.setItem(TOKEN_KEY, userToken);
      this.messageService.connect();
      if (options?.user) {
        this.userService.initializeUser(options.user);
        return this.halFormService.initialize().pipe(map(() => options.user as User));
      } else {
        return this.userService
          .fetchCurrentUser()
          .pipe(tap((fetchedUser) => this.userService.initializeUser(fetchedUser)));
      }
    } else return EMPTY;
  }

  public clearSession(): Observable<Resource> {
    this.userService.clearUser();
    this.messageService.disconnect();
    this._removeToken();
    return this.halFormService.initialize();
  }

  private _validateToken(token: string): boolean {
    if (isTokenExpired(token)) {
      this._removeToken();
      return false;
    } else return true;
  }

  private _removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
