import { Pact } from '@pact-foundation/pact';
import * as path from 'path';

export function pactForResource(resource: string, suffix = 'Controller'): Pact {
  return new Pact({
    consumer: `app-${resource}`,
    provider: 'api',
    log: path.resolve(process.cwd(), 'libs', 'consumer-pact', 'logs', 'pact.log'),
    logLevel: 'debug',
    dir: path.resolve(process.cwd(), 'apps', 'api', 'target', 'test-classes', 'pact', resource + suffix),
    cors: true,
    timeout: 10000,
    spec: 2,
    pactfileWriteMode: 'overwrite',
  });
}
