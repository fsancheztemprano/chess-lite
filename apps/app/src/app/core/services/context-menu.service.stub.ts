import { Injectable } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Injectable({ providedIn: 'root' })
export class StubContextMenuService implements Partial<ContextMenuService> {}

export const stubContextMenuServiceProvider = {
  provide: ContextMenuService,
  useClass: StubContextMenuService,
};
