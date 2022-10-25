import { TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster.service.model';

class StubToastrService {
  show = jest.fn();
}

describe('ToasterService', () => {
  let service: ToasterService;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [ToasterService, { provide: ToastrService, useClass: StubToastrService }],
    });
    service = TestBed.inject(ToasterService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show toast', () => {
    service.showToast();

    expect(toastrService.show).toHaveBeenCalledWith(
      undefined,
      undefined,
      {
        timeOut: 5000,
        closeButton: true,
        disableTimeOut: false,
        enableHtml: false,
        tapToDismiss: true,
      },
      ToastType.INFO,
    );
  });

  it('should show toasty toast', () => {
    service.showToast({
      message: 'message',
      title: 'title',
    });

    expect(toastrService.show).toHaveBeenCalledWith(
      'message',
      'title',
      {
        timeOut: 5000,
        closeButton: true,
        disableTimeOut: false,
        enableHtml: false,
        tapToDismiss: true,
      },
      ToastType.INFO,
    );
  });

  it('should show info toast', () => {
    service.showInfoToast({
      message: 'message',
      title: 'title',
      override: {
        timeOut: 1000,
        closeButton: false,
      },
    });

    expect(toastrService.show).toHaveBeenCalledWith(
      'message',
      'title',
      {
        timeOut: 1000,
        closeButton: false,
        disableTimeOut: false,
        enableHtml: false,
        tapToDismiss: true,
      },
      ToastType.INFO,
    );
  });

  it('should show error toast', () => {
    service.showErrorToast({
      message: 'message',
      title: 'title',
      override: {
        timeOut: 1000,
        closeButton: false,
      },
    });

    expect(toastrService.show).toHaveBeenCalledWith(
      'message',
      'title',
      {
        timeOut: 1000,
        closeButton: false,
        disableTimeOut: false,
        enableHtml: false,
        tapToDismiss: true,
      },
      ToastType.ERROR,
    );
  });

  it('should show warning toast', () => {
    service.showWarningToast({
      message: 'message',
      title: 'title',
      override: {
        timeOut: 1000,
        closeButton: false,
      },
    });

    expect(toastrService.show).toHaveBeenCalledWith(
      'message',
      'title',
      {
        timeOut: 1000,
        closeButton: false,
        disableTimeOut: false,
        enableHtml: false,
        tapToDismiss: true,
      },
      ToastType.WARNING,
    );
  });

  it('should show success toast', () => {
    service.showSuccessToast({
      message: 'message',
      title: 'title',
      override: {
        timeOut: 1000,
        closeButton: false,
      },
    });

    expect(toastrService.show).toHaveBeenCalledWith(
      'message',
      'title',
      {
        timeOut: 1000,
        closeButton: false,
        disableTimeOut: false,
        enableHtml: false,
        tapToDismiss: true,
      },
      ToastType.SUCCESS,
    );
  });

  it('should show link toast', () => {
    service.showLinkToast({
      message: 'message',
      title: 'title',
      link: '/link',
      linkCaption: 'linkCaption',
      override: {
        timeOut: 1000,
        closeButton: false,
      },
    });

    expect(toastrService.show).toHaveBeenCalledWith(
      "<a download href='/link' target='_blank'>linkCaption</a>",
      'title',
      {
        closeButton: false,
        disableTimeOut: false,
        enableHtml: true,
        timeOut: 1000,
        tapToDismiss: true,
      },
      ToastType.LINK,
    );
  });
});
