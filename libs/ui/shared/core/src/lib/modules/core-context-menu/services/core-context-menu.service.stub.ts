import { Injectable } from '@angular/core';
import { CoreContextMenuService } from './core-context-menu.service';

@Injectable({ providedIn: 'root' })
export class StubCoreContextMenuService implements Partial<CoreContextMenuService> {}

export const stubCoreContextMenuServiceProvider = {
  provide: CoreContextMenuService,
  useClass: StubCoreContextMenuService,
};
