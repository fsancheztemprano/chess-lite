import { HttpHeaders } from '@angular/common/http';

export function parseHeaders(headers?: HttpHeaders | { [header: string]: string | string[] }):
  | {
      [header: string]: string | string[];
    }
  | undefined {
  if (headers instanceof HttpHeaders) {
    return headers
      .keys()
      .reduce(
        (acc, key) => ({ ...acc, [key]: headers.getAll(key)!.length > 1 ? headers.getAll(key) : headers.get(key) }),
        {},
      );
  }
  return headers;
}
