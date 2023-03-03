import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';

export interface SidebarProps {
  isActive?: boolean;
  isOpen?: boolean;
}

const store = createStore({ name: 'sidebar' }, withProps<SidebarProps>({ isActive: true }));

@Injectable({ providedIn: 'root' })
export class SidebarRepository {
  isOpen$ = store.pipe(select((sidebar) => sidebar.isOpen));
  isActive$ = store.pipe(select((sidebar) => sidebar.isActive));
  showSidebar$ = store.pipe(select((sidebar) => sidebar.isActive && sidebar.isOpen));

  toggleIsOpen(): void {
    store.update((state) => ({ ...state, isOpen: !state.isOpen }));
  }

  setIsOpen(isOpen?: boolean): void {
    store.update((state) => ({ ...state, isOpen }));
  }

  setIsActive(isActive?: boolean): void {
    store.update((state) => ({ ...state, isActive }));
  }
}
