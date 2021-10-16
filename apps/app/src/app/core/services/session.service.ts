import { Injectable } from '@angular/core';
import { TOKEN_KEY, User } from '@app/domain';
import { HalFormService, Resource } from '@hal-form-client';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
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
    this._validateToken(localStorage.getItem(TOKEN_KEY));
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
        return this.userService.fetchCurrentUser().pipe(
          tap((fetchedUser) => this.userService.initializeUser(fetchedUser)),
          catchError(() => this.clearSession()),
        );
      }
    } else return EMPTY;
  }

  public clearSession(): Observable<Resource> {
    this.userService.clearUser();
    this.messageService.disconnect();
    localStorage.removeItem(TOKEN_KEY);
    return this.halFormService.initialize();
  }

  private _validateToken(token: string | null): boolean {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    } else return true;
  }
}
