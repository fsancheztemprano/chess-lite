import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface TabLink {
  target: string[];
  label: string;
}

export interface MenuOption {
  onClick: () => void;
  label: string;
  icon?: string;

  disabled?: Subject<boolean>;
}

export interface HeaderConfig {
  navigationLink?: string[];
  title?: string;
  titleRation?: number;
  tabs?: TabLink[];
  tabsRation?: number;
  showOptionsButton?: boolean;
  options?: MenuOption[];
}

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly defaultConfig = {
    navigationLink: [''],
    options: [],
    showOptionsButton: false,
    tabs: [],
    tabsRatio: 1,
    title: 'App',
    titleRatio: 1,
  };

  private _navigationLink: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.defaultConfig.navigationLink);
  private _title: BehaviorSubject<string> = new BehaviorSubject<string>(this.defaultConfig.title);
  private _titleRatio: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultConfig.titleRatio);
  private _tabs: BehaviorSubject<TabLink[]> = new BehaviorSubject<TabLink[]>(this.defaultConfig.tabs);
  private _tabsRatio: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultConfig.tabsRatio);
  private _showOptionsButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.defaultConfig.showOptionsButton,
  );
  private _options: BehaviorSubject<MenuOption[]> = new BehaviorSubject<MenuOption[]>(this.defaultConfig.options);

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

  get showOptionsButton(): Observable<boolean> {
    return this._showOptionsButton.asObservable();
  }

  get options(): Observable<MenuOption[]> {
    return this._options.asObservable();
  }

  resetHeader() {
    this.setHeader();
  }

  setHeader(config?: HeaderConfig) {
    this._navigationLink.next(config?.navigationLink || this.defaultConfig.navigationLink);
    this._title.next(config?.title || this.defaultConfig.title);
    this._tabs.next(config?.tabs || this.defaultConfig.tabs);
    this._options.next(config?.options || this.defaultConfig.options);
    this._showOptionsButton.next(config?.showOptionsButton || this.defaultConfig.showOptionsButton);
    this._titleRatio.next(config?.titleRation || this.defaultConfig.titleRatio);
    this._tabsRatio.next(config?.tabsRation || this.defaultConfig.tabsRatio);
  }
}
