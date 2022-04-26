import { Injectable } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { createStore, select, setProps, withProps } from '@ngneat/elf';
import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CoreContextMenuProps {
  menuOptions: MenuData[];
}

const coreContextMenuStore = createStore(
  { name: 'coreContextMenu' },
  withProps<CoreContextMenuProps>({
    menuOptions: [],
  }),
);

@Injectable({ providedIn: 'root' })
export class CoreContextMenuRepository {
  coreContextMenuOptions$: Observable<MenuData[]> = coreContextMenuStore.pipe(select((core) => core.menuOptions));

  public setOptions(options?: MenuData[]): void {
    coreContextMenuStore.update(setProps({ menuOptions: options || [] }));
  }
}
