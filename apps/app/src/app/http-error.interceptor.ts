import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { ToasterService, ToastType } from '@app/ui/shared';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly ngZone: NgZone, private readonly toasterService: ToasterService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.ngZone.run(() => {
          if (!environment.production) {
            console.warn(error);
          }
          this.toasterService.showToast({
            title: `${error.statusText} [${error.status}]`,
            message: `${error.error.title} <br> ${error.error.time}`,
            type: ToastType.ERROR,
            override: { enableHtml: true },
          });
        });
        return throwError(() => error);
      }),
    );
  }
}
