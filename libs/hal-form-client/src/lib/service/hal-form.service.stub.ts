import { Injectable } from '@angular/core';
import { HalFormService } from '@chess-lite/hal-form-client';

@Injectable({ providedIn: 'root' })
export class StubHalFormService implements Partial<HalFormService> {}

export const stubStubHalFormServiceProvider = {
  provide: HalFormService,
  useClass: StubHalFormService,
};
