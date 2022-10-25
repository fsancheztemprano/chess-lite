import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { IsMobileService } from './is-mobile.service';

class StubBreakpointObserver {
  breakpointObserver = new BehaviorSubject<{ matches: boolean }>({ matches: false });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(value: string): Observable<{ matches: boolean }> {
    return this.breakpointObserver.asObservable();
  }
}

describe('IsMobileService', () => {
  let service: IsMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BreakpointObserver, useClass: StubBreakpointObserver }],
    });
    service = TestBed.inject(IsMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return breakpoint observer true', (done) => {
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as StubBreakpointObserver;

    breakpointObserver.breakpointObserver.next({ matches: true });

    service.isMobile$.subscribe((isMobile) => {
      expect(isMobile).toBeTrue();
      done();
    });
  });

  it('should return breakpoint observer false', (done) => {
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as StubBreakpointObserver;

    breakpointObserver.breakpointObserver.next({ matches: false });

    service.isMobile$.subscribe((isMobile) => {
      expect(isMobile).toBeFalse();
      done();
    });
  });

  it('should return breakpoint true negated', (done) => {
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as StubBreakpointObserver;

    breakpointObserver.breakpointObserver.next({ matches: true });

    service.isDesktop$.subscribe((isDesktop) => {
      expect(isDesktop).toBeFalse();
      done();
    });
  });

  it('should return breakpoint false negated', (done) => {
    const breakpointObserver = TestBed.inject(BreakpointObserver) as unknown as StubBreakpointObserver;

    breakpointObserver.breakpointObserver.next({ matches: false });

    service.isDesktop$.subscribe((isDesktop) => {
      expect(isDesktop).toBeTrue();
      done();
    });
  });
});
