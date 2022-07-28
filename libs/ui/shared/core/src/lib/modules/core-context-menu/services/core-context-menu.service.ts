import { Injectable } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoreContextMenuService {
  private readonly _showMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _options$: BehaviorSubject<MenuData[]> = new BehaviorSubject<MenuData[]>([]);

  get showMenu$(): Observable<boolean> {
    return this._showMenu$.asObservable();
  }

  set showMenu(show: boolean) {
    this._showMenu$.next(show);
  }

  get options$(): Observable<MenuData[]> {
    return this._options$.asObservable();
  }

  set options(options: MenuData[]) {
    this._options$.next(options);
  }

  show(options: MenuData[]): void {
    this.options = options;
    this.showMenu = true;
  }

  reset(): void {
    this.showMenu = false;
    this.options = [];
  }
}
