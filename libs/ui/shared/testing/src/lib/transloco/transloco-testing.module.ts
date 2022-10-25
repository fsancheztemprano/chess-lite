import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';

export function getTranslocoModule(options: TranslocoTestingOptions = {}): TranslocoTestingModule {
  return TranslocoTestingModule.forRoot({
    langs: { en: {}, es: {} },
    translocoConfig: {
      availableLangs: ['en', 'es'],
      defaultLang: 'en',
    },
    preloadLangs: true,
    ...options,
  });
}
