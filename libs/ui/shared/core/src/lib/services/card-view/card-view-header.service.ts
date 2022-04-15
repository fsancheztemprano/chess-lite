import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreadcrumbService } from '../toolbar/breadcrumb.service';
import { HeaderConfig, TabLink } from './card-view-header.service.model';

@Injectable({
  providedIn: 'root',
})
export class CardViewHeaderService {
  private readonly DEFAULT_CONFIG = {
    navigationLink: null,
    showContextMenu: false,
    tabs: [],
    tabsRatio: 1,
    title: 'App',
    titleRatio: 1,
  };

  private readonly _navigationLink: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(
    this.DEFAULT_CONFIG.navigationLink,
  );
  private readonly _title: BehaviorSubject<string> = new BehaviorSubject<string>(this.DEFAULT_CONFIG.title);
  private readonly _titleRatio: BehaviorSubject<number> = new BehaviorSubject<number>(this.DEFAULT_CONFIG.titleRatio);
  private readonly _tabs: BehaviorSubject<TabLink[]> = new BehaviorSubject<TabLink[]>(this.DEFAULT_CONFIG.tabs);
  private readonly _tabsRatio: BehaviorSubject<number> = new BehaviorSubject<number>(this.DEFAULT_CONFIG.tabsRatio);
  private readonly _showContextMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.DEFAULT_CONFIG.showContextMenu,
  );

  constructor(private readonly breadcrumbService: BreadcrumbService) {}

  get navigationLink(): Observable<string[]> {
    return this._navigationLink
      .asObservable()
      .pipe(
        switchMap((navigationLink) =>
          navigationLink
            ? of(navigationLink as string[])
            : this.breadcrumbService.getNavigationUp$().pipe(map((upLink) => [upLink])),
        ),
      );
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
    this._navigationLink.next(header?.navigationLink || this.DEFAULT_CONFIG.navigationLink);
    this._title.next(header?.title || this.DEFAULT_CONFIG.title);
    this._tabs.next(header?.tabs || this.DEFAULT_CONFIG.tabs);
    this._titleRatio.next(header?.titleRation || this.DEFAULT_CONFIG.titleRatio);
    this._tabsRatio.next(header?.tabsRation || this.DEFAULT_CONFIG.tabsRatio);
    this._showContextMenu.next(!!header?.showContextMenu);
  }
}
