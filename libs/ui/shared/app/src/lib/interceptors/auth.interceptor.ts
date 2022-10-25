import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenKeys, USE_REFRESH_TOKEN } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { isValidToken } from '../utils/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token: string | null = localStorage.getItem(TokenKeys.TOKEN);
    if (request.context.get(USE_REFRESH_TOKEN)) {
      token = localStorage.getItem(TokenKeys.REFRESH_TOKEN);
    }
    if (isValidToken(token)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
