import { HttpHeaders } from '@angular/common/http';
import { ContentType } from '../domain/domain';
import { parseHeaders } from './headers.utils';

describe('parseHeaders', () => {
  it('should extract all headers into an object', () => {
    const headers = new HttpHeaders({
      'Content-Type': ContentType.APPLICATION_JSON,
      Accept: [ContentType.APPLICATION_JSON, ContentType.APPLICATION_JSON_HAL_FORMS],
    });
    expect(parseHeaders(headers)).toEqual({
      'Content-Type': ContentType.APPLICATION_JSON,
      Accept: [ContentType.APPLICATION_JSON, ContentType.APPLICATION_JSON_HAL_FORMS],
    });
  });

  it('should return raw headers if defined', () => {
    expect(
      parseHeaders({
        'Content-Type': ContentType.APPLICATION_JSON,
        Accept: [ContentType.APPLICATION_JSON, ContentType.APPLICATION_JSON_HAL_FORMS],
      }),
    ).toEqual({
      'Content-Type': ContentType.APPLICATION_JSON,
      Accept: [ContentType.APPLICATION_JSON, ContentType.APPLICATION_JSON_HAL_FORMS],
    });
  });

  it('should return undefined if no headers provided', () => {
    expect(parseHeaders(undefined)).toBeFalsy();
  });
});
