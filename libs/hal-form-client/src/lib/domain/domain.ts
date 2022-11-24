import { HttpContext, HttpHeaders } from '@angular/common/http';

export const DEFAULT_LINK = 'self';
export const DEFAULT_TEMPLATE = 'default';

export interface HalParameters {
  [key: string]: any;
}

export interface LinkOptions {
  parameters?: HalParameters;
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
}

export interface AffordanceOptions extends LinkOptions {
  body?: any;
}

export enum HalFormsEntityName {
  LINK = 'link',
  EMBEDDED = 'embedded',
  TEMPLATE = 'template',
}

export enum ContentType {
  APPLICATION_JSON = 'application/json',
  APPLICATION_JSON_HAL = 'application/hal+json',
  APPLICATION_JSON_HAL_FORMS = 'application/prs.hal-forms+json',
  APPLICATION_OCTET_STREAM = 'application/octet-stream',
  MULTIPART_FILE = 'multipart/form-data',
  TEXT_PLAIN = 'text/plain',
}

export enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

export const SUPPORTED_HTTP_METHODS = Object.keys(HttpMethod);

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
