import { Observable, throwError } from 'rxjs';

export function notAllowedError(templateName: string): Observable<never> {
  return throwError(() => new Error(`Not allowed to ${templateName}!`));
}

export function noLinkError(templateName: string): Observable<never> {
  return throwError(() => new Error(`No link to ${templateName}!`));
}

export enum HalFormsEntityName {
  LINK = 'link',
  EMBEDDED = 'embedded',
  TEMPLATE = 'template',
}

export function noEntityError(
  errorMessage: string | Error | undefined,
  entity: HalFormsEntityName,
  key: string,
): Error {
  let error;
  if (errorMessage) {
    if (typeof errorMessage === 'string') {
      error = Error(errorMessage);
    } else {
      error = errorMessage;
    }
  } else {
    error = Error(`Can not find ${entity}: ${key}`);
  }
  return error;
}
