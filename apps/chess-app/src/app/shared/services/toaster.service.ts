import { Injectable } from '@angular/core';
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

  constructor(private readonly toastrService: ToastrService) {}

  showToast(toast: IToastModel): ActiveToast<unknown> {
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

  private showLinkToast(toast: IToastModel) {
    const message = `<a download href='${toast.link}' target='_blank'>${toast.linkCaption}</a>`;
    return this.toastrService.show(message, toast.title, toast.override, toast.type);
  }
}
