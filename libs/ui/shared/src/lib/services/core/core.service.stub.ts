import { Injectable } from '@angular/core';
import { noop, of } from 'rxjs';
import { CoreComponentStyle, CoreService } from './core.service';

@Injectable({ providedIn: 'root' })
export class StubCoreService implements Partial<CoreService> {
  setCardViewHeader = noop;
  setShowContextMenu = noop;
  setContextMenuOptions = noop;
  reset = noop;
  setCoreStyle = noop;
  getCoreStyle = () => of('card' as CoreComponentStyle);
}

export const stubCoreServiceProvider = {
  provide: CoreService,
  useClass: StubCoreService,
};
