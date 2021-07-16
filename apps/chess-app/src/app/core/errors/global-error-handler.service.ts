import { ErrorHandler, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { ToastType } from '../services/toaster.service.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly ngZone: NgZone, @Inject(Injector) private readonly injector: Injector) {}

  handleError(error: Error): void {
    this.ngZone.run(() =>
      this.toasterService.showToast({ title: error.name, message: error.message, type: ToastType.ERROR }),
    );
  }

  private get toasterService(): ToasterService {
    return this.injector.get(ToasterService);
  }
}
