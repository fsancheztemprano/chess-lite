import { filter, Observable } from 'rxjs';
import { isNonNull } from '../../misc/is-non-null';

export function filterNulls<T>(): (observable: Observable<T | null>) => Observable<T> {
  return (observable: Observable<T | null>) => {
    return observable.pipe(filter(isNonNull));
  };
}
