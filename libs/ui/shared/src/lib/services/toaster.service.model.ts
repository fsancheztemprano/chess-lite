import { IndividualConfig } from 'ngx-toastr/toastr/toastr-config';

export enum ToastType {
  SUCCESS = 'success',
  INFO = 'info',
  LINK = 'link',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface IToastModel {
  message?: string;
  title?: string;
  override?: Partial<IndividualConfig>;
  type?: ToastType;
  link?: string;
  linkCaption?: string;
}
