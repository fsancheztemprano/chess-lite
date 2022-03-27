import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { ToasterService, ToastType } from '@app/ui/shared/app';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly ngZone: NgZone, private readonly toasterService: ToasterService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          this.ngZone.run(() => {
            this.toasterService.showToast(
              error.error?.time
                ? {
                    title: `${error.statusText} [${error.status}]`,
                    message: `${error.error.title} <br> ${error.error.time}`,
                    type: ToastType.ERROR,
                    override: { enableHtml: true },
                  }
                : {
                    title: `${error.statusText}`,
                    type: ToastType.ERROR,
                  },
            );
          });
        },
      }),
    );
  }
}
