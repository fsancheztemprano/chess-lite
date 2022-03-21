import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ToasterService, ToastType } from '@app/ui/shared/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly ngZone: NgZone, private readonly toasterService: ToasterService) {}

  handleError(error: Error): void {
    if (!environment.production) {
      console.warn(error);
    }
    this.ngZone.run(() => {
      this.toasterService.showToast({ title: error.name, message: error.message, type: ToastType.ERROR });
    });
  }
}
