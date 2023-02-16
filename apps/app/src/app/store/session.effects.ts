import { Injectable } from '@angular/core';
import {
  clearSession,
  initializeSession,
  SessionProps,
  SessionRepository,
  SessionService,
  updateSession,
} from '@app/ui/shared/app';
import { createEffect, ofType } from '@ngneat/effects';
import { switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionEffects {
  constructor(private readonly sessionRepository: SessionRepository, private readonly sessionService: SessionService) {}

  clearSession$ = createEffect((actions) =>
    actions.pipe(
      ofType(clearSession),
      switchMap(() => this.sessionService.clearSession()),
    ),
  );

  initializeSession$ = createEffect((actions) =>
    actions.pipe(
      ofType(initializeSession),
      switchMap(({ session }) => this.sessionService.initialize(session)),
    ),
  );

  updateSession$ = createEffect((actions) => {
    return actions.pipe(
      ofType(updateSession),
      tap((session: SessionProps) => this.sessionRepository.updateSession(session)),
    );
  });
}
