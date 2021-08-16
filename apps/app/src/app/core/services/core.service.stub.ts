import { Injectable } from '@angular/core';
import { noop } from 'rxjs';
import { CoreService } from './core.service';

@Injectable({ providedIn: 'root' })
export class StubCoreService implements Partial<CoreService> {
  setHeader = noop;
  setShowContextMenu = noop;
  setContextMenuOptions = noop;
}

export const stubCoreServiceProvider = {
  provide: CoreService,
  useClass: StubCoreService,
};
