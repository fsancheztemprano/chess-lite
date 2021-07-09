import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HalFormService } from './hal-form.service';

@Injectable({ providedIn: 'root' })
export class StubHalFormService implements Partial<HalFormService> {
  hasLink = () => of(true);
}

export const stubHalFormServiceProvider = {
  provide: HalFormService,
  useClass: StubHalFormService,
};
