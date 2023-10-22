import { ErrorHandler, Injectable, isDevMode, NgZone } from '@angular/core';
import { ToasterService, ToastType } from '@app/ui/shared/app';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private readonly ngZone: NgZone,
    private readonly toasterService: ToasterService,
  ) {}

  handleError(error: Error): void {
    if (!isDevMode()) {
      console.warn(error);
    }
    this.ngZone.run(() => {
      this.toasterService.showToast({ title: error.name, message: error.message, type: ToastType.ERROR });
    });
  }
}

export const GlobalErrorHandlerProvider = {
  provide: ErrorHandler,
  useClass: GlobalErrorHandler,
};
