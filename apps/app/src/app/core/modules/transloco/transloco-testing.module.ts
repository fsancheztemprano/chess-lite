import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';
import * as en from '../../../../assets/i18n/en.json';
import * as es from '../../../../assets/i18n/es.json';

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { en, es },
    translocoConfig: {
      availableLangs: ['en', 'es'],
      defaultLang: 'en',
    },
    preloadLangs: true,
    ...options,
  });
}
