import { APP_INITIALIZER, Injectable } from '@angular/core';
import { initializeSession } from '@app/ui/shared/app';
import { Actions } from '@ngneat/effects-ng';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppInitializationService {
  constructor(private readonly actions: Actions) {}

  initialize(): Observable<unknown> {
    this.actions.dispatch(initializeSession({}));
    return of(void 0);
  }
}

function initializeApp(appInitService: AppInitializationService) {
  return (): Observable<unknown> => {
    return appInitService.initialize();
  };
}

export const AppInitializationProvider = {
  provide: APP_INITIALIZER,
  useFactory: initializeApp,
  deps: [AppInitializationService],
  multi: true,
};
