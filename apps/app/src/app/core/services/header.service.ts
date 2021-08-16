import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HeaderConfig, TabLink } from './header.service.model';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly defaultConfig = {
    navigationLink: [''],
    showContextMenu: false,
    tabs: [],
    tabsRatio: 1,
    title: 'App',
    titleRatio: 1,
  };

  private readonly _navigationLink: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    this.defaultConfig.navigationLink,
  );
  private readonly _title: BehaviorSubject<string> = new BehaviorSubject<string>(this.defaultConfig.title);
  private readonly _titleRatio: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultConfig.titleRatio);
  private readonly _tabs: BehaviorSubject<TabLink[]> = new BehaviorSubject<TabLink[]>(this.defaultConfig.tabs);
  private readonly _tabsRatio: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultConfig.tabsRatio);
  private readonly _showContextMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.defaultConfig.showContextMenu,
  );

  get navigationLink(): Observable<string[]> {
    return this._navigationLink.asObservable();
  }

  get title(): Observable<string> {
    return this._title.asObservable();
  }

  get titleRatio(): Observable<number> {
    return this._titleRatio.asObservable();
  }

  get tabs(): Observable<TabLink[]> {
    return this._tabs.asObservable();
  }

  get tabsRatio(): Observable<number> {
    return this._tabsRatio.asObservable();
  }

  get showContextMenu(): Observable<boolean> {
    return this._showContextMenu.asObservable();
  }

  setShowContextMenu(show?: boolean) {
    this._showContextMenu.next(!!show);
  }

  resetHeader() {
    this.setHeader();
  }

  setHeader(header?: HeaderConfig) {
    this._navigationLink.next(header?.navigationLink || this.defaultConfig.navigationLink);
    this._title.next(header?.title || this.defaultConfig.title);
    this._tabs.next(header?.tabs || this.defaultConfig.tabs);
    this._titleRatio.next(header?.titleRation || this.defaultConfig.titleRatio);
    this._tabsRatio.next(header?.tabsRation || this.defaultConfig.tabsRatio);
    this._showContextMenu.next(!!header?.showContextMenu);
  }
}
