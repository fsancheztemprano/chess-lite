import * as parser from 'url-template';
import { HalParameters } from '../domain/domain';

export function parseUrl(url: string, parameters?: HalParameters): string {
  return parser.parse(url).expand(parameters || {});
}
