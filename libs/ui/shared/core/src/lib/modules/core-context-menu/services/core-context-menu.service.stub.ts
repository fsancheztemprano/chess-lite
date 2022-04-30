import { Injectable } from '@angular/core';
import { noop } from 'rxjs';
import { CoreContextMenuService } from './core-context-menu.service';

@Injectable({ providedIn: 'root' })
export class StubCoreContextMenuService implements Partial<CoreContextMenuService> {
  setOptions = noop;
  resetOptions = noop;
}

export const stubCoreContextMenuServiceProvider = {
  provide: CoreContextMenuService,
  useClass: StubCoreContextMenuService,
};
