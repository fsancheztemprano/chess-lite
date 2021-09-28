import { Injectable } from '@angular/core';
import { HalFormService } from '@hal-form-client';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  constructor(
    private readonly halFormService: HalFormService,
    private readonly sessionService: SessionService,
    private readonly translationService: TranslationService,
  ) {}

  initialize(): Observable<unknown> {
    return forkJoin([
      this.translationService.initialize(),
      this.halFormService.initialize().pipe(switchMap(() => this.sessionService.initialize())),
    ]);
  }
}
