import { Injectable } from '@angular/core';
import { HalFormService } from '@hal-form-client';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializationService {
  constructor(private readonly halFormService: HalFormService, private readonly sessionService: SessionService) {}

  initialize(): Observable<unknown> {
    return this.halFormService.initialize().pipe(switchMap(() => this.sessionService.initialize()));
  }
}
