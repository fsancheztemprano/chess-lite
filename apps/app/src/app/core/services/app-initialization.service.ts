import { Injectable } from '@angular/core';
import { HalFormService } from '@hal-form-client';
import { forkJoin, Observable, switchMapTo } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { TranslationService } from '../../shared/services/translation.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  constructor(
    private readonly halFormService: HalFormService,
    private readonly authService: AuthService,
    private readonly translationService: TranslationService,
  ) {}

  initialize(): Observable<unknown> {
    return forkJoin([
      this.translationService.initialize(),
      this.halFormService.initialize().pipe(switchMapTo(this.authService.initialize())),
    ]);
  }
}
