import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { PreferencesService } from './preferences.service';
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
    private readonly translateService: TranslocoService,
    private readonly preferencesService: PreferencesService,
  ) {
    this.preferencesService.contentLanguage
      .pipe(untilDestroyed(this))
      .subscribe((language) => this.setActiveLanguage(language));
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

  setActiveLanguage(language: string | undefined) {
    const validLanguage =
      (language && this.availableLanguages.find((lang) => lang.id === language)) || this.defaultLanguage;
    this._activeLanguage$.next(validLanguage);
    this.translateService.setActiveLang(validLanguage.id);
  }
}
