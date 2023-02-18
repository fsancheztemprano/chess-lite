import { MessageConsumerPact, PactV3, V3Interaction } from '@pact-foundation/pact';
import { RegexMatcher, term, UUID_V4_FORMAT } from '@pact-foundation/pact/src/dsl/matchers';
import { regex } from '@pact-foundation/pact/src/v3/matchers';
import { V3MockServer } from '@pact-foundation/pact/src/v3/types';
import { resolve } from 'path';
import { setPactUrl } from '../interceptor/pact.interceptor';

export function pactForResource(resource: string, suffix = 'Controller'): PactV3 {
  return new PactV3({
    consumer: `app-${resource}`,
    provider: 'api',
    // log: resolve(process.cwd(), 'coverage', 'pact', 'logs', 'api.log'),
    logLevel: 'warn',
    dir: resolve(process.cwd(), 'apps', 'api', 'target', 'test-classes', 'pact', resource + suffix),
    cors: true,
    // timeout: 10000,
    spec: 4,
    // pactfileWriteMode: 'update',
  });
}

export function pactForMessages(resource: string, suffix = 'Messages'): MessageConsumerPact {
  return new MessageConsumerPact({
    consumer: `app-${resource}`,
    provider: 'ami',
    log: resolve(process.cwd(), 'coverage', 'pact', 'logs', 'ami.log'),
    logLevel: 'warn',
    dir: resolve(process.cwd(), 'apps', 'api', 'target', 'test-classes', 'pact-messages', resource + suffix),
    spec: 4,
    pactfileWriteMode: 'update',
  });
}

export const BEARER_TOKEN_REGEX = /^Bearer\s([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)$/;

export function bearer(token?: string) {
  const defaultToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  return term({
    generate: `Bearer ${token || defaultToken}`,
    matcher: BEARER_TOKEN_REGEX.source,
  });
}

export const JWT_TOKEN_REGEX = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)$/;

export function jwt(token?: string) {
  const defaultToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  return term({
    generate: token || defaultToken,
    matcher: JWT_TOKEN_REGEX.source,
  });
}

export function jwtv3(token?: string) {
  const defaultToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  return regex(JWT_TOKEN_REGEX.source, token || defaultToken);
}

export function withUuid(string?: string): RegexMatcher<string> {
  let generate = string || '/{uuid}';
  generate = generate.replace(/{uuid}/, 'ce118b6e-d8e1-11e7-9296-cec278b6b50a');
  let matcher = string || '/{uuid}';
  matcher = matcher.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  matcher = matcher.replace(/\\{uuid\\}/, UUID_V4_FORMAT.slice(1, -1));
  matcher = `^${matcher}$`;
  return term({
    generate,
    matcher,
  });
}

export interface JsonObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function executeInteractionTest<T>(
  provider: PactV3,
  interaction: V3Interaction,
  testFn: (mockServer: V3MockServer) => Promise<T>,
): Promise<T | undefined> {
  provider.addInteraction(interaction);
  return provider.executeTest((server: V3MockServer) => {
    setPactUrl(server.url);
    return testFn(server);
  });
}
