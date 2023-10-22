import { parseTemplate } from 'url-template';
import { HalParameters } from '../domain/domain';

export function parseUrl(url: string, parameters?: HalParameters): string {
  return parseTemplate(url).expand(parameters || {});
}
