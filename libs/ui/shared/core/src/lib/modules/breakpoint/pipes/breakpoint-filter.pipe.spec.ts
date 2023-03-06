import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../breakpoint.service.stub';
import { BreakpointFilter, BreakpointFilterPipe } from './breakpoint-filter.pipe';

describe('BreakpointFilterPipe', () => {
  let pipe: BreakpointFilterPipe;
  let breakpointService: StubBreakpointService;

  const overFilters: BreakpointFilter[] = [
    { breakpoint: Breakpoint.XS, value: 'xs' },
    { breakpoint: Breakpoint.S, value: 's' },
    { breakpoint: Breakpoint.M, value: 'm' },
    { breakpoint: Breakpoint.L, value: 'l' },
    { breakpoint: Breakpoint.XL, value: 'xl' },
  ];

  const isFilters: BreakpointFilter[] = overFilters.map((filter) => ({ ...filter, strategy: 'is' }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BreakpointFilterPipe],
      providers: [stubBreakpointServiceProvider, BreakpointFilterPipe],
    });

    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
    pipe = TestBed.inject(BreakpointFilterPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter values over', async () => {
    breakpointService._breakpoint$.next(Breakpoint.XS);
    await expect(firstValueFrom(pipe.transform(overFilters))).resolves.toEqual(['xs']);

    breakpointService._breakpoint$.next(Breakpoint.S);
    await expect(firstValueFrom(pipe.transform(overFilters))).resolves.toEqual(['xs', 's']);

    breakpointService._breakpoint$.next(Breakpoint.M);
    await expect(firstValueFrom(pipe.transform(overFilters))).resolves.toEqual(['xs', 's', 'm']);

    breakpointService._breakpoint$.next(Breakpoint.L);
    await expect(firstValueFrom(pipe.transform(overFilters))).resolves.toEqual(['xs', 's', 'm', 'l']);

    breakpointService._breakpoint$.next(Breakpoint.XL);
    return expect(firstValueFrom(pipe.transform(overFilters))).resolves.toEqual(['xs', 's', 'm', 'l', 'xl']);
  });

  it('should filter values is', async () => {
    breakpointService._breakpoint$.next(Breakpoint.XS);
    await expect(firstValueFrom(pipe.transform(isFilters))).resolves.toEqual(['xs']);

    breakpointService._breakpoint$.next(Breakpoint.S);
    await expect(firstValueFrom(pipe.transform(isFilters))).resolves.toEqual(['s']);

    breakpointService._breakpoint$.next(Breakpoint.M);
    await expect(firstValueFrom(pipe.transform(isFilters))).resolves.toEqual(['m']);

    breakpointService._breakpoint$.next(Breakpoint.L);
    await expect(firstValueFrom(pipe.transform(isFilters))).resolves.toEqual(['l']);

    breakpointService._breakpoint$.next(Breakpoint.XL);
    return expect(firstValueFrom(pipe.transform(isFilters))).resolves.toEqual(['xl']);
  });
});
