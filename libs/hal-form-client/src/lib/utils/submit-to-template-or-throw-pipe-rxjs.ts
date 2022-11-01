import { Observable, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';
import { AffordanceOptions } from '../domain/domain';
import { Resource } from '../domain/resource';

export function submitToTemplateOrThrowPipe<T extends Resource = Resource>(
  template?: string,
  options?: AffordanceOptions,
): (observable: Observable<T>) => Observable<T> {
  return (observable: Observable<T>) => {
    return observable.pipe(
      first(),
      switchMap((resource) => resource.affordTemplate<T>({ template, ...options })),
    );
  };
}
