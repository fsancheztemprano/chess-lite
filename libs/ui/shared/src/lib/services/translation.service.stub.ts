import { Injectable } from '@angular/core';
import { TranslationService } from './translation.service';

@Injectable({ providedIn: 'root' })
export class StubTranslationService implements Partial<TranslationService> {}

export const stubTranslationServiceProvider = {
  provide: TranslationService,
  useClass: StubTranslationService,
};
