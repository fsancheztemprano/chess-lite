import { Injectable } from '@angular/core';
import { sidebarIsActive, sidebarIsOpen, SidebarRepository, sidebarToggleOpen } from '@app/ui/shared/core';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarEffects {
  constructor(private readonly sidebarRepository: SidebarRepository) {}

  sidebarIsOpen$ = createEffect((actions) =>
    actions.pipe(
      ofType(sidebarIsOpen),
      tap(({ isOpen }) => this.sidebarRepository.setIsOpen(isOpen)),
    ),
  );

  sidebarToggleOpen$ = createEffect((actions) =>
    actions.pipe(
      ofType(sidebarToggleOpen),
      tap(() => this.sidebarRepository.toggleIsOpen()),
    ),
  );

  sidebarIsActive$ = createEffect((actions) =>
    actions.pipe(
      ofType(sidebarIsActive),
      tap(({ isActive }) => this.sidebarRepository.setIsActive(isActive)),
    ),
  );
}
