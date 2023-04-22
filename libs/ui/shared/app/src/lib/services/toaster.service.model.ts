import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';

export enum ToastType {
  SUCCESS = 'toast-success',
  INFO = 'toast-info',
  LINK = 'toast-link',
  WARNING = 'toast-warning',
  ERROR = 'toast-error',
}

export interface IToastModel {
  message?: string;
  title?: string;
  override?: Partial<IndividualConfig>;
  type?: ToastType;
  link?: string;
  linkCaption?: string;
  linkDownload?: boolean;
  linkSelf?: boolean;
}
