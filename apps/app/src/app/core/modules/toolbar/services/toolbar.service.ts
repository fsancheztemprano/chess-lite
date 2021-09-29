import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToolbarConfig } from './toolbar.service.model';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  private readonly DEFAULT_TOOLBAR: ToolbarConfig = {
    showContextMenu: false,
    showLocalePicker: true,
    showThemePicker: true,
    title: 'Application Title',
  };
  private readonly _showLocalePicker: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.DEFAULT_TOOLBAR.showLocalePicker,
  );
  private readonly _showThemePicker: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.DEFAULT_TOOLBAR.showThemePicker,
  );
  private readonly _showContextMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.DEFAULT_TOOLBAR.showContextMenu,
  );
  private readonly _title: BehaviorSubject<string> = new BehaviorSubject<string>(this.DEFAULT_TOOLBAR.title);

  get showLocalePicker(): Observable<boolean> {
    return this._showLocalePicker.asObservable();
  }

  get showThemePicker(): Observable<boolean> {
    return this._showThemePicker.asObservable();
  }

  get showContextMenu(): Observable<boolean> {
    return this._showContextMenu.asObservable();
  }

  get title(): Observable<string> {
    return this._title.asObservable();
  }

  setTitle(title: string) {
    this._title.next(title || this.DEFAULT_TOOLBAR.title);
  }

  setShowLocalePicker(show?: boolean) {
    this._showLocalePicker.next(!!show);
  }

  setShowThemePicker(show?: boolean) {
    this._showThemePicker.next(!!show);
  }

  setShowContextMenu(show?: boolean) {
    this._showContextMenu.next(!!show);
  }

  setToolbar(toolbar?: ToolbarConfig) {
    this.setShowLocalePicker(!!toolbar?.showLocalePicker);
    this.setShowThemePicker(!!toolbar?.showThemePicker);
    this.setShowContextMenu(!!toolbar?.showContextMenu);
  }

  resetToolbar() {
    this.setShowLocalePicker(this.DEFAULT_TOOLBAR.showLocalePicker);
    this.setShowThemePicker(this.DEFAULT_TOOLBAR.showThemePicker);
    this.setShowContextMenu(this.DEFAULT_TOOLBAR.showContextMenu);
  }
}
