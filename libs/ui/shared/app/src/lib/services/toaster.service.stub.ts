import { Injectable } from '@angular/core';
import { ActiveToast } from 'ngx-toastr';
import { ToasterService } from './toaster.service';

@Injectable({ providedIn: 'root' })
export class StubToasterService implements Partial<ToasterService> {
  showToast = () => ({}) as ActiveToast<unknown>;
}

export const stubToasterServiceProvider = {
  provide: ToasterService,
  useClass: StubToasterService,
};
