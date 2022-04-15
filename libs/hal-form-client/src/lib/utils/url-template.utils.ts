import * as parser from 'url-template';

export function parseUrl(url: string, parameters?: any): string {
  return parser.parse(url).expand(parameters || {});
}
