import { Injectable } from '@angular/core';
import { noop } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({ providedIn: 'root' })
export class StubHeaderService implements Partial<HeaderService> {
  setHeader = noop;
}

export const stubHeaderServiceProvider = {
  provide: HeaderService,
  useClass: StubHeaderService,
};
