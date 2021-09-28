import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToasterService } from '../services/toaster.service';
import { ToastType } from '../services/toaster.service.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly ngZone: NgZone, private readonly toasterService: ToasterService) {}

  handleError(error: Error): void {
    this.ngZone.run(() => {
      if (!environment.production) {
        console.warn(error);
      }
      this.toasterService.showToast({ title: error.name, message: error.message, type: ToastType.ERROR });
    });
  }
}
