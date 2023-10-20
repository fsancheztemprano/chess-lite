import {
  bearer,
  BEARER_TOKEN_REGEX,
  jwt,
  JWT_TOKEN_REGEX,
  pactForMessages,
  pactForResource,
  withUuid,
} from './pact.utils';

describe('Pact Utils Tests', () => {
  it('should return a pact provider', () => {
    const actual = pactForResource('test');
    expect(actual.opts.consumer).toBeTruthy();
    expect(actual.opts.provider).toBeTruthy();
    expect(actual.opts.log).toBeTruthy();
    expect(actual.opts.logLevel).toBeTruthy();
    expect(actual.opts.dir).toBeTruthy();
    expect(actual.opts.cors).toBeTruthy();
    expect(actual.opts.timeout).toBeTruthy();
    expect(actual.opts.pactfileWriteMode).toBeTruthy();
  });

  it('should return a pact message provider', () => {
    const actual = pactForMessages('test');
    expect(actual['config'].consumer).toBeTruthy();
    expect(actual['config'].provider).toBeTruthy();
    expect(actual['config'].log).toBeTruthy();
    expect(actual['config'].logLevel).toBeTruthy();
    expect(actual['config'].dir).toBeTruthy();
    expect(actual['config'].pactfileWriteMode).toBeTruthy();
  });

  it('should replace uuid with regex and uuid', () => {
    const actual = withUuid('/api/{uuid}');
    expect(actual.value).toBe('/api/ce118b6e-d8e1-11e7-9296-cec278b6b50a');
    expect(actual.regex).toBe('^\\/api\\/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$');
  });

  it('should generate jwt token matcher', () => {
    const actual = jwt(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );
    expect(actual.value).toBe(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );
    expect(actual.regex).toBe(JWT_TOKEN_REGEX.source);
  });

  it('should generate jwt token bearer string matcher', () => {
    const actual = bearer(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );
    expect(actual.value).toBe(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );
    expect(actual.regex).toBe(BEARER_TOKEN_REGEX.source);
  });
});
