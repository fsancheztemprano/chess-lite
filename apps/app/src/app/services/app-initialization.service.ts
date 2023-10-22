import { APP_INITIALIZER, Injectable } from '@angular/core';
import { SessionService, ThemeService } from '@app/ui/shared/app';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppInitializationService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly themeService: ThemeService,
  ) {}

  initialize(): Observable<unknown> {
    return this.sessionService.initialize().pipe(switchMap(() => this.themeService.initializeTheme()));
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
