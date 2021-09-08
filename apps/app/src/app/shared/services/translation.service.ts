import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PreferencesService } from '../../core/services/preferences.service';
import { Language } from './translation.service.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly AVAILABLE_LANGUAGES: Language[] = [
    { id: 'en', iso3166: 'gb' },
    { id: 'es', iso3166: 'es' },
  ];
  private readonly DEFAULT_LANGUAGE = this.AVAILABLE_LANGUAGES[0];
  private readonly _activeLanguage$ = new BehaviorSubject<Language>(this.DEFAULT_LANGUAGE);

  constructor(
    private readonly translateService: TranslateService,
    private readonly preferencesService: PreferencesService,
  ) {
    this.preferencesService.contentLanguage
      .pipe(untilDestroyed(this))
      .subscribe((language) => this.setActiveLanguage(language));
  }

  initialize() {
    this.translateService.setDefaultLang(this.DEFAULT_LANGUAGE.id);
    return this.setActiveLanguage(this.translateService.getBrowserLang());
  }

  get availableLanguages(): Language[] {
    return this.AVAILABLE_LANGUAGES;
  }

  get defaultLanguage(): Language {
    return this.DEFAULT_LANGUAGE;
  }

  get activeLanguage(): Observable<Language> {
    return this._activeLanguage$.asObservable();
  }

  setActiveLanguage(language: string | undefined): Observable<unknown> {
    const validLanguage =
      (language && this.availableLanguages.find((lang) => lang.id === language)) || this.defaultLanguage;
    this._activeLanguage$.next(validLanguage);
    return this.translateService.use(validLanguage.id);
  }
}
