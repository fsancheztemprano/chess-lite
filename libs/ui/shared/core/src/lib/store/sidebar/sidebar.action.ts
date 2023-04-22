import { actionsFactory, props } from '@ngneat/effects';

const sessionActions = actionsFactory('Sidebar');

export const sidebarIsOpen = sessionActions.create('Set Is Open', props<{ isOpen?: boolean }>());
export const sidebarToggleOpen = sessionActions.create('Toggle Is Open');
export const sidebarIsActive = sessionActions.create('Set Is Active', props<{ isActive?: boolean }>());
