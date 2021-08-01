import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToasterService } from '../services/toaster.service';
import { ToastType } from '../services/toaster.service.model';

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
            title: error.status + ' | ' + error.statusText,
            message:
              error.status === 504 ? error.message : JSON.stringify({ url: error.url, ...error.error }, null, '<br>'),
            type: ToastType.ERROR,
            override: { enableHtml: true },
          });
        });
        return throwError(() => error);
      }),
    );
  }
}
