import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HalFormService } from './hal-form.service';

@Injectable({ providedIn: 'root' })
export class StubHalFormService implements Partial<HalFormService> {
  hasLink = () => of(true);
}

export const stubStubHalFormServiceProvider = {
  provide: HalFormService,
  useClass: StubHalFormService,
};
