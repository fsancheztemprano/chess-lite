import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { PreferencesService } from './preferences.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly darkMode = new BehaviorSubject(false);

  constructor(private readonly preferencesService: PreferencesService) {
    this.setDarkMode((localStorage.getItem('darkMode') || 'false') === 'true');
    this.preferencesService.darkMode.pipe(untilDestroyed(this)).subscribe((darkMode) => this.setDarkMode(darkMode));
  }

  public setDarkMode(darkMode: boolean) {
    localStorage.setItem('darkMode', String(darkMode));
    this.darkMode.next(darkMode);
  }

  public getDarkMode(): Observable<boolean> {
    return this.darkMode.asObservable();
  }
}
