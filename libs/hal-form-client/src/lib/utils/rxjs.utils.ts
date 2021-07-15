import { Observable, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';
import { Resource } from '../domain/resource';

export function submitToTemplateOrThrowPipe(
  templateName: string,
  payload?: any,
  params?: any,
  observe: 'body' | 'events' | 'response' = 'body',
): (observable: Observable<Resource>) => Observable<any> {
  return (observable: Observable<Resource>) => {
    return observable.pipe(
      first(),
      switchMap((resource) => resource.submitToTemplateOrThrow(templateName, payload, params, observe || 'body')),
    );
  };
}
