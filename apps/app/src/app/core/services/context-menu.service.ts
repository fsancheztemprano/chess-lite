import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuOption } from './context-menu.service.model';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private readonly DEFAULT_OPTIONS = [];
  private readonly _options: BehaviorSubject<MenuOption[]> = new BehaviorSubject<MenuOption[]>(this.DEFAULT_OPTIONS);

  get options(): Observable<MenuOption[]> {
    return this._options.asObservable();
  }

  setOptions(options?: MenuOption[]): void {
    this._options.next(options || this.DEFAULT_OPTIONS);
  }

  resetOptions(): void {
    this.setOptions();
  }
}
