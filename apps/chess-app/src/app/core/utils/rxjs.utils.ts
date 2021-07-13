import { Observable, throwError } from 'rxjs';

export function notAllowedError(templateName: string): Observable<never> {
  return throwError(() => new Error(`Not allowed to ${templateName}!`));
}
