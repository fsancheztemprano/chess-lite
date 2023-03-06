import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoint } from './breakpoint.model';
import { BreakpointService } from './breakpoint.service';

class StubBreakpointObserver {
  breakpointObserver = new BehaviorSubject<Breakpoint>(Breakpoint.XS);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(value: string[]): Observable<Partial<BreakpointState>> {
    return this.breakpointObserver.asObservable().pipe(
      map((breakpoint) => ({
        breakpoints: {
          [Breakpoints.XSmall]: breakpoint === Breakpoint.XS,
          [Breakpoints.Small]: breakpoint === Breakpoint.S,
          [Breakpoints.Medium]: breakpoint === Breakpoint.M,
          [Breakpoints.Large]: breakpoint === Breakpoint.L,
          [Breakpoints.XLarge]: breakpoint === Breakpoint.XL,
        },
      })),
    );
  }
}

const breakpoints = [Breakpoint.XS, Breakpoint.S, Breakpoint.M, Breakpoint.L, Breakpoint.XL];
describe('BreakpointService', () => {
  let service: BreakpointService;
  let breakpointObserver: StubBreakpointObserver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BreakpointObserver, useClass: StubBreakpointObserver }],
    });
    service = TestBed.inject(BreakpointService);
    breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as StubBreakpointObserver;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each(breakpoints)('should get breakpoint %p', async (breakpoint) => {
    breakpointObserver.breakpointObserver.next(breakpoint);
    return expect(firstValueFrom(service.breakpoint$)).resolves.toBe(breakpoint);
  });

  it.each(breakpoints)('should get is breakpoint %p', (breakpoint) => {
    breakpointObserver.breakpointObserver.next(breakpoint);

    return expect(firstValueFrom(service.isBreakpoint$(breakpoint))).resolves.toBeTrue();
  });

  it.each(breakpoints)('should get is not breakpoint %p', (breakpoint) => {
    breakpointObserver.breakpointObserver.next(breakpoint);

    return expect(
      firstValueFrom(service.isBreakpoint$(breakpoint === Breakpoint.XS ? Breakpoint.S : Breakpoint.XS)),
    ).resolves.toBeFalse();
  });

  it('should get is xs', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.XS);
    await expect(firstValueFrom(service.isXs$)).resolves.toBeTrue();
  });

  it('should get not is xs', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.S);
    await expect(firstValueFrom(service.isXs$)).resolves.toBeFalse();
  });

  it('should get is s', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.S);
    await expect(firstValueFrom(service.isS$)).resolves.toBeTrue();
  });

  it('should get not is s', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.M);
    return expect(firstValueFrom(service.isS$)).resolves.toBeFalse();
  });

  it('should get is m', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.M);
    await expect(firstValueFrom(service.isM$)).resolves.toBeTrue();
  });

  it('should get not is m', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.L);
    return expect(firstValueFrom(service.isM$)).resolves.toBeFalse();
  });

  it('should get is l', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.L);
    await expect(firstValueFrom(service.isL$)).resolves.toBeTrue();
  });

  it('should get not is l', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.XL);
    return expect(firstValueFrom(service.isL$)).resolves.toBeFalse();
  });

  it('should get is xl', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.XL);
    await expect(firstValueFrom(service.isXl$)).resolves.toBeTrue();
  });

  it('should get not is xl', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.L);
    return expect(firstValueFrom(service.isXl$)).resolves.toBeFalse();
  });

  it('should get is over', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.M);
    await expect(firstValueFrom(service.overBreakpoint$(Breakpoint.S))).resolves.toBeTrue();
  });

  it('should get is on', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.M);
    await expect(firstValueFrom(service.overBreakpoint$(Breakpoint.M))).resolves.toBeTrue();
  });

  it('should get is not over', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.M);
    await expect(firstValueFrom(service.overBreakpoint$(Breakpoint.L))).resolves.toBeFalse();
  });

  it('should get is over s', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.M);
    await expect(firstValueFrom(service.overS$)).resolves.toBeTrue();
  });

  it('should get is not over s', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.XS);
    await expect(firstValueFrom(service.overS$)).resolves.toBeFalse();
  });

  it('should get is over m', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.L);
    await expect(firstValueFrom(service.overM$)).resolves.toBeTrue();
  });

  it('should get is not over m', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.S);
    await expect(firstValueFrom(service.overM$)).resolves.toBeFalse();
  });

  it('should get is over l', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.XL);
    await expect(firstValueFrom(service.overL$)).resolves.toBeTrue();
  });

  it('should get is not over l', async () => {
    breakpointObserver.breakpointObserver.next(Breakpoint.M);
    await expect(firstValueFrom(service.overL$)).resolves.toBeFalse();
  });
});
