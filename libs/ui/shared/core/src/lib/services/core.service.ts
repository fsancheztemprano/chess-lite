import { Injectable } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { BehaviorSubject, Observable } from 'rxjs';
import { CoreContextMenuService } from '../modules/core-context-menu/services/core-context-menu.service';
import { CardViewHeaderService } from './card-view/card-view-header.service';
import { HeaderConfig } from './card-view/card-view-header.service.model';
import { ToolbarService } from './toolbar/toolbar.service';

export type CoreComponentStyle = 'raw' | 'card';
export const DEFAULT_STYLE: CoreComponentStyle = 'card';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private _coreStyle: BehaviorSubject<CoreComponentStyle> = new BehaviorSubject<CoreComponentStyle>('card');

  constructor(
    private readonly _toolbarService: ToolbarService,
    private readonly _cardViewHeaderService: CardViewHeaderService,
    private readonly _contextMenuService: CoreContextMenuService,
  ) {}

  getCoreStyle(): Observable<CoreComponentStyle> {
    return this._coreStyle.asObservable();
  }

  setCoreStyle(value: CoreComponentStyle) {
    this._coreStyle.next(value);
  }

  setShowContextMenu(show?: boolean): void {
    this._toolbarService.setShowContextMenu(show);
    this._cardViewHeaderService.setShowContextMenu(show);
  }

  get toolbarService(): ToolbarService {
    return this._toolbarService;
  }

  get cardViewHeaderService(): CardViewHeaderService {
    return this._cardViewHeaderService;
  }

  get contextMenuService(): CoreContextMenuService {
    return this._contextMenuService;
  }

  setCardViewHeader(header?: HeaderConfig): void {
    this.cardViewHeaderService.setHeader(header);
  }

  setContextMenuOptions(options?: MenuData[]): void {
    this.contextMenuService.setOptions(options);
  }

  reset(): void {
    this.cardViewHeaderService.resetHeader();
    this.contextMenuService.resetOptions();
    this.toolbarService.resetToolbar();
    this.setCoreStyle(DEFAULT_STYLE);
  }
}
