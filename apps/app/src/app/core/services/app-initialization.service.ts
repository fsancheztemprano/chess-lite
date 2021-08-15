import { Injectable } from '@angular/core';
import { HalFormService } from '@hal-form-client';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
      this.halFormService
        .initialize()
        .pipe(tap(() => this.authService.isAuthenticated() && this.authService.fetchCurrentUser().subscribe())),
    ]);
  }
}
