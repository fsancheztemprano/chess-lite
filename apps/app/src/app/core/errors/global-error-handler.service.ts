import { ErrorHandler, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToasterService } from '../../shared/services/toaster.service';
import { ToastType } from '../../shared/services/toaster.service.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly ngZone: NgZone, @Inject(Injector) private readonly injector: Injector) {}

  handleError(error: Error): void {
    this.ngZone.run(() => {
      if (!environment.production) {
        console.warn(error);
      }
      this.toasterService.showToast({ title: error.name, message: error.message, type: ToastType.ERROR });
    });
  }

  private get toasterService(): ToasterService {
    return this.injector.get(ToasterService);
  }
}
