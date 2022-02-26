import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AuthInterceptorProvider } from 'apps/app/src/app/auth/interceptors/auth.interceptor';
import { Observable } from 'rxjs';

export const PACT_BASE_URL = new InjectionToken<number>('Provided Pact Base Url');

@Injectable()
export class PactInterceptor implements HttpInterceptor {
  constructor(@Inject(PACT_BASE_URL) public pactBaseUrl: string) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const separator = request.url.charAt(0) === '/' ? '' : '/';
    const url = this.pactBaseUrl + separator + request.url;
    return next.handle(request.clone({ url }));
  }
}

export const PactInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: PactInterceptor,
  multi: true,
};

export function avengersAssemble(pactBaseUrl = ''): unknown[] {
  const urlProvider = {
    provide: PACT_BASE_URL,
    useValue: pactBaseUrl,
  };
  return [urlProvider, PactInterceptorProvider, AuthInterceptorProvider];
}
