import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AuthInterceptorProvider } from 'libs/ui/authorization/src/lib/interceptors/auth.interceptor';
import { Observable } from 'rxjs';

export const PACT_BASE_URL = new InjectionToken<number>('Provided Pact Base Url');

@Injectable()
export class PactInterceptor implements HttpInterceptor {
  constructor(@Inject(PACT_BASE_URL) public pactBaseUrl: string) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let url = request.url.replace('http://localhost', '');
    const separator = url.charAt(0) === '?' || url.charAt(0) === '/' ? '' : '/';
    url = this.pactBaseUrl + separator + url;
    return next.handle(request.clone({ url }));
  }
}

export const PactInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: PactInterceptor,
  multi: true,
};

export function avengersAssemble(pactBaseUrl = ''): unknown[] {
  return [{ provide: PACT_BASE_URL, useValue: pactBaseUrl }, PactInterceptorProvider, AuthInterceptorProvider];
}
