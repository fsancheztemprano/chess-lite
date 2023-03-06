import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { distinctUntilChanged, Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoint } from './breakpoint.model';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private readonly _breakpoint$: Observable<Breakpoint> = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
    .pipe(
      map((breakpointState: BreakpointState): Breakpoint => {
        switch (true) {
          case breakpointState.breakpoints[Breakpoints.XSmall]:
            return Breakpoint.XS;
          case breakpointState.breakpoints[Breakpoints.Small]:
            return Breakpoint.S;
          case breakpointState.breakpoints[Breakpoints.Medium]:
            return Breakpoint.M;
          case breakpointState.breakpoints[Breakpoints.Large]:
            return Breakpoint.L;
          case breakpointState.breakpoints[Breakpoints.XLarge]:
            return Breakpoint.XL;
          default:
            return -1;
        }
      }),
      distinctUntilChanged(),
      shareReplay(),
    );

  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  get breakpoint$(): Observable<Breakpoint> {
    return this._breakpoint$;
  }

  isBreakpoint$(breakpoint: Breakpoint): Observable<boolean> {
    return this._breakpoint$.pipe(map((currentBreakpoint: Breakpoint) => currentBreakpoint === breakpoint));
  }

  get isXs$(): Observable<boolean> {
    return this.isBreakpoint$(Breakpoint.XS);
  }

  get isS$(): Observable<boolean> {
    return this.isBreakpoint$(Breakpoint.S);
  }

  get isM$(): Observable<boolean> {
    return this.isBreakpoint$(Breakpoint.M);
  }

  get isL$(): Observable<boolean> {
    return this.isBreakpoint$(Breakpoint.L);
  }

  get isXl$(): Observable<boolean> {
    return this.isBreakpoint$(Breakpoint.XL);
  }

  overBreakpoint$(breakpoint: Breakpoint): Observable<boolean> {
    return this._breakpoint$.pipe(map((currentBreakpoint: Breakpoint) => breakpoint <= currentBreakpoint));
  }

  get overS$(): Observable<boolean> {
    return this.overBreakpoint$(Breakpoint.S);
  }

  get overM$(): Observable<boolean> {
    return this.overBreakpoint$(Breakpoint.M);
  }

  get overL$(): Observable<boolean> {
    return this.overBreakpoint$(Breakpoint.L);
  }
}
