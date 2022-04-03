import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuOption } from './context-menu.service.model';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private readonly _options: BehaviorSubject<MenuOption[]> = new BehaviorSubject<MenuOption[]>([]);

  get options(): Observable<MenuOption[]> {
    return this._options.asObservable();
  }

  setOptions(options?: MenuOption[]): void {
    this._options.next(options || []);
  }

  resetOptions(): void {
    this.setOptions();
  }
}
