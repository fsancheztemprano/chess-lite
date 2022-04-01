import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import { TranslocoService } from '@ngneat/transloco';
import { localizationStore } from './localization.store';

@Injectable({ providedIn: 'root' })
export class LocalizationRepository {
  contentLanguage$ = localizationStore.pipe(select((state) => state.contentLanguage));

  constructor(private readonly translateService: TranslocoService) {}

  public readonly availableLanguages: string[] = ['en', 'es'];

  public updateContentLanguage(contentLanguage: string) {
    localizationStore.update((state) => {
      return {
        ...state,
        contentLanguage,
      };
    });
    this.translateService.setActiveLang(contentLanguage);
  }
}
