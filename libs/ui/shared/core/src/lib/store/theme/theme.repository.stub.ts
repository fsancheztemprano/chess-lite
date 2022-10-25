import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeRepository } from './theme.repository';

@Injectable({ providedIn: 'root' })
export class StubThemeRepository implements Partial<ThemeRepository> {
  darkMode$ = new BehaviorSubject<boolean>(false);

  public updateDarkMode(darkMode: boolean): void {
    this.darkMode$.next(darkMode);
  }
}

export const stubThemeRepositoryProvider = {
  provide: ThemeRepository,
  useClass: StubThemeRepository,
};
