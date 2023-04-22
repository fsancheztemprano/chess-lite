import { Pipe, PipeTransform } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../services/breakpoint.service';

@UntilDestroy()
@Pipe({
  name: 'breakpointFilter',
  standalone: true,
})
export class BreakpointFilterPipe implements PipeTransform {
  constructor(private readonly service: BreakpointService) {}

  transform<T>(toFilter: Array<BreakpointFilter<T>>): Observable<T[]> {
    return this.service.breakpoint$.pipe(
      untilDestroyed(this),
      map((breakpoint) =>
        toFilter
          .filter(
            (filter) =>
              filter?.breakpoint === null ||
              filter?.breakpoint === undefined ||
              (filter.strategy === 'is' ? filter.breakpoint === breakpoint : filter.breakpoint <= breakpoint),
          )
          .map((filter) => filter.value),
      ),
    );
  }
}

export interface BreakpointFilter<T = string> {
  breakpoint?: Breakpoint;
  strategy?: 'is' | 'over';
  value: T;
}
