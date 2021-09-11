import { Injectable } from '@angular/core';
import { ContextMenuService } from './context-menu.service';
import { MenuOption } from './context-menu.service.model';
import { HeaderService } from './header.service';
import { HeaderConfig } from './header.service.model';
import { ToolbarService } from './toolbar.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(
    private readonly _toolbarService: ToolbarService,
    private readonly _headerService: HeaderService,
    private readonly _contextMenuService: ContextMenuService,
  ) {}

  get toolbarService(): ToolbarService {
    return this._toolbarService;
  }

  get headerService(): HeaderService {
    return this._headerService;
  }

  get contextMenuService(): ContextMenuService {
    return this._contextMenuService;
  }

  setShowContextMenu(show?: boolean): void {
    this._toolbarService.setShowContextMenu(show);
    this._headerService.setShowContextMenu(show);
  }

  setHeader(header?: HeaderConfig): void {
    this._headerService.setHeader(header);
    if (header?.options?.length) {
      this._contextMenuService.setOptions(header?.options);
    }
  }

  setContextMenuOptions(options?: MenuOption[]): void {
    this._contextMenuService.setOptions(options);
  }

  reset(): void {
    this._headerService.resetHeader();
    this._contextMenuService.resetOptions();
    this._toolbarService.resetToolbar();
  }
}
