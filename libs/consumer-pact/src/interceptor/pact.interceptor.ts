import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthInterceptorProvider } from '@app/ui/shared/app';
import { Observable } from 'rxjs';

export const PACT_BASE_URL = new InjectionToken<number>('Provided Pact Base Url');

@Injectable({
  providedIn: 'root',
})
export class PactInterceptor implements HttpInterceptor {
  public pactBaseUrl = '';

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

export function avengersAssemble(): unknown[] {
  return [PactInterceptorProvider, AuthInterceptorProvider];
}

export function setPactUrl(url: string) {
  TestBed.inject(HTTP_INTERCEPTORS)
    .filter((x) => x instanceof PactInterceptor)
    .forEach((interceptor: HttpInterceptor) => ((<PactInterceptor>interceptor).pactBaseUrl = url));
}
