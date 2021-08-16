import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class StubThemeService implements Partial<ThemeService> {
  getDarkMode = () => of(false);
}

export const stubThemeServiceProvider = {
  provide: ThemeService,
  useClass: StubThemeService,
};
