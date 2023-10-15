import { resolve } from 'path';
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
    expect(actual.opts.consumer).toBe('app-test');
    expect(actual.opts.provider).toBe('api');
    expect(actual.opts.log).toBe(resolve(process.cwd(), 'coverage', 'pact', 'logs', 'api.log'));
    expect(actual.opts.logLevel).toBe('warn');
    expect(actual.opts.dir).toBe(
      resolve(process.cwd(), 'apps', 'api', 'target', 'test-classes', 'pact', 'testController'),
    );
    expect(actual.opts.cors).toBe(true);
    expect(actual.opts.timeout).toBe(10000);
    expect(actual.opts.pactfileWriteMode).toBe('merge');
  });

  it('should return a pact message provider', () => {
    const actual = pactForMessages('test');
    expect(actual['config'].consumer).toBe('app-test');
    expect(actual['config'].provider).toBe('ami');
    expect(actual['config'].log).toBe(resolve(process.cwd(), 'coverage', 'pact', 'logs', 'ami.log'));
    expect(actual['config'].logLevel).toBe('warn');
    expect(actual['config'].dir).toBe(
      resolve(process.cwd(), 'apps', 'api', 'target', 'test-classes', 'pact-messages', 'testMessages'),
    );
    expect(actual['config'].pactfileWriteMode).toBe('merge');
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
