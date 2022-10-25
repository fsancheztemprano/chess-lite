import { from, tap } from 'rxjs';
import { filterNulls } from './filter-null.rxjs.pipe';

describe('filterNulls', () => {
  it('should filter null emissions', (done) => {
    from([null, undefined, '', 0, false, true, 'truthy', {}, 1, [], [0], [0, 1]])
      .pipe(
        filterNulls(),
        tap((truthy) => expect(truthy).toBeTruthy()),
      )
      .subscribe({
        complete: () => {
          done();
        },
      });
  });
});
