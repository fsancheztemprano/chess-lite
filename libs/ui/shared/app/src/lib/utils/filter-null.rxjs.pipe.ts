import { filter, Observable } from 'rxjs';

function isTruthy<T>(value: T): value is NonNullable<T> {
  return !!value;
}

export function filterNulls<T>(): (observable: Observable<T | null | undefined>) => Observable<T> {
  return (observable: Observable<T | null | undefined>) => {
    return observable.pipe(filter(isTruthy));
  };
}
