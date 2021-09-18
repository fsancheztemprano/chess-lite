import { Inject, Injectable, Injector } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';
import { IToastModel, ToastType } from './toaster.service.model';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  private readonly toastrConfig: Partial<IndividualConfig> = {
    closeButton: true,
    timeOut: 5000,
    disableTimeOut: false,
    enableHtml: false,
    tapToDismiss: true,
  };
  private _toastrService: ToastrService | undefined;

  constructor(@Inject(Injector) private readonly injector: Injector) {}

  private get toastrService(): ToastrService {
    if (!this._toastrService) {
      this._toastrService = this.injector.get(ToastrService);
    }
    return this._toastrService;
  }

  showToast(toast: IToastModel): ActiveToast<unknown> {
    toast = toast || {};
    toast.type = toast.type || ToastType.INFO;
    switch (toast?.type) {
      case ToastType.ERROR:
      case ToastType.INFO:
      case ToastType.SUCCESS:
      case ToastType.WARNING:
        return this.toastrService.show(
          toast.message,
          toast.title,
          (toast.override && { ...this.toastrConfig, ...toast.override }) || this.toastrConfig,
          toast.type || ToastType.INFO,
        );
      case ToastType.LINK:
        return this.showLinkToast(toast);
      default:
        return this.toastrService.show();
    }
  }

  showErrorToast(toast: IToastModel): ActiveToast<unknown> {
    return this.showToast({ ...toast, type: ToastType.ERROR });
  }

  showInfoToast(toast: IToastModel): ActiveToast<unknown> {
    return this.showToast({ ...toast, type: ToastType.INFO });
  }

  showWarningToast(toast: IToastModel): ActiveToast<unknown> {
    return this.showToast({ ...toast, type: ToastType.WARNING });
  }

  showSuccessToast(toast: IToastModel): ActiveToast<unknown> {
    return this.showToast({ ...toast, type: ToastType.SUCCESS });
  }

  private showLinkToast(toast: IToastModel) {
    const message = `<a download href='${toast.link}' target='_blank'>${toast.linkCaption}</a>`;
    return this.toastrService.show(message, toast.title, toast.override, toast.type);
  }
}
