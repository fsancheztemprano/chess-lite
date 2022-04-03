import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalizationRepository } from './localization.repository';

@Injectable({ providedIn: 'root' })
export class StubLocalizationRepository implements Partial<LocalizationRepository> {
  contentLanguage$ = new BehaviorSubject<string>('en');

  public readonly availableLanguages: string[] = ['en', 'es'];

  public updateContentLanguage(contentLanguage: string) {
    this.contentLanguage$.next(contentLanguage);
  }
}

export const stubLocalizationRepositoryProvider = {
  provide: LocalizationRepository,
  useClass: StubLocalizationRepository,
};
