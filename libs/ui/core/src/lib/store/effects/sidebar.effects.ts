import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { sidebarIsActive, sidebarIsOpen, SidebarRepository, sidebarToggleOpen } from '@app/ui/shared/core';
import { createEffect, ofType } from '@ngneat/effects';
import { Actions } from '@ngneat/effects-ng';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarEffects {
  constructor(
    private readonly sidebarRepository: SidebarRepository,
    private readonly router: Router,
    private readonly actions: Actions,
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this._isSidebarConfigured(this.router.routerState.snapshot.root)),
        distinctUntilChanged(),
      )
      .subscribe((isActive: boolean) => actions.dispatch(sidebarIsActive({ isActive })));
  }

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

  private _isSidebarConfigured(route: ActivatedRouteSnapshot): boolean {
    return route.children.some((child) => this._isSidebarConfigured(child)) || route.outlet === 'sidebar';
  }
}
