import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoint } from './breakpoint.model';
import { BreakpointService } from './breakpoint.service';

@Injectable({
  providedIn: 'root',
})
export class StubBreakpointService implements Partial<BreakpointService> {
  public readonly _breakpoint$: BehaviorSubject<Breakpoint> = new BehaviorSubject<Breakpoint>(Breakpoint.L);

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

export const stubBreakpointServiceProvider = {
  provide: BreakpointService,
  useClass: StubBreakpointService,
};
