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

  showToast(toast?: IToastModel): ActiveToast<unknown> {
    toast = toast || {};
    toast.type = toast.type || ToastType.INFO;
    switch (toast?.type) {
      case ToastType.LINK:
        return this.toastrService.show(
          `${toast.message}<br><br>
          <a [download]='${toast.linkDownload}' href='${toast.link}' target='${toast.linkSelf ? '_self' : '_blank'}'>${
            toast.linkCaption || 'Link'
          }</a>`,
          toast.title,
          { ...this.toastrConfig, ...toast.override, enableHtml: true },
          toast.type,
        );
      case ToastType.ERROR:
      case ToastType.INFO:
      case ToastType.SUCCESS:
      case ToastType.WARNING:
      default:
        return this.toastrService.show(
          toast.message,
          toast.title,
          { ...this.toastrConfig, ...toast.override },
          toast.type || ToastType.INFO,
        );
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

  showLinkToast(toast: IToastModel): ActiveToast<unknown> {
    return this.showToast({ ...toast, type: ToastType.LINK });
  }
}
