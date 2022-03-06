import { Observable, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';
import { Resource } from '../domain/resource';
import { AffordanceOptions } from '../domain/template';

export function submitToTemplateOrThrowPipe<T extends Resource = Resource>(
  templateName?: string,
  options?: AffordanceOptions,
): (observable: Observable<T>) => Observable<T> {
  return (observable: Observable<T>) => {
    return observable.pipe(
      first(),
      switchMap((resource) => resource.submitToTemplateOrThrow<T>(templateName, options)),
    );
  };
}
