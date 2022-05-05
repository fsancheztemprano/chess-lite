import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { localizationStore } from './localization.store';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class LocalizationRepository {
  contentLanguage$ = localizationStore.pipe(select((state) => state.contentLanguage));

  constructor(private readonly translateService: TranslocoService) {
    this.contentLanguage$.pipe(untilDestroyed(this)).subscribe((contentLanguage) => {
      this.translateService.setActiveLang(contentLanguage);
    });
  }

  public readonly availableLanguages: string[] = ['en', 'es'];

  public updateContentLanguage(contentLanguage: string) {
    localizationStore.update((state) => {
      return {
        ...state,
        contentLanguage,
      };
    });
  }
}
