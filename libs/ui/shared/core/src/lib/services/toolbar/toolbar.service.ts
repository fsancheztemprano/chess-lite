import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToolbarService {
  private readonly _showLocalePicker$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _showThemePicker$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get showLocalePicker$(): Observable<boolean> {
    return this._showLocalePicker$.asObservable();
  }

  set showLocalePicker(show: boolean) {
    this._showLocalePicker$.next(show);
  }

  get showThemePicker$(): Observable<boolean> {
    return this._showThemePicker$.asObservable();
  }

  set showThemePicker(show: boolean) {
    this._showThemePicker$.next(show);
  }
}
