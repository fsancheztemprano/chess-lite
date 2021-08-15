import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export enum LanguageEnum {
  EN = 'en',
  ES = 'es',
}

export const AVAILABLE_LANGUAGES = Object.values<string>(LanguageEnum);

export const DEFAULT_LANGUAGE = LanguageEnum.EN;

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private readonly translateService: TranslateService) {}

  initialize() {
    this.translateService.setDefaultLang(DEFAULT_LANGUAGE);

    const browserLanguage = this.translateService.getBrowserLang();
    const language = AVAILABLE_LANGUAGES.includes(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE;
    return this.translateService.use(language);
  }
}
