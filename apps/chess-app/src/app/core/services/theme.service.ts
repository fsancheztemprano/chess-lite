import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly darkMode = new BehaviorSubject(false);

  constructor() {
    this.setDarkMode((localStorage.getItem('darkMode') || 'false') === 'true');
  }

  public setDarkMode(darkMode: boolean) {
    localStorage.setItem('darkMode', String(darkMode));
    this.darkMode.next(darkMode);
  }

  public getDarkMode(): Observable<boolean> {
    return this.darkMode.asObservable();
  }
}
