import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export interface LocalizationProps {
  contentLanguage: string;
}

const localizationStore = createStore(
  { name: 'localization' },
  withProps<LocalizationProps>({ contentLanguage: 'en' }),
);

persistState(localizationStore, { key: 'localization', storage: localStorageStrategy });

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
