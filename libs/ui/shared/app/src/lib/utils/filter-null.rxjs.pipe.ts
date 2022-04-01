import { filter, Observable } from 'rxjs';

function isTruthy<T>(value: T): value is NonNullable<T> {
  return !!value;
}

export function filterNulls<T>(): (observable: Observable<T | null>) => Observable<T> {
  return (observable: Observable<T | null>) => {
    return observable.pipe(filter(isTruthy));
  };
}
