import { Component, Input, NgModule } from '@angular/core';
import { TiledMenuTileData } from '../../model/tiled-menu.model';
import { TiledMenuTileComponent } from '../tiled-menu-tile/tiled-menu-tile.component';
import { TiledMenuComponent } from './tiled-menu.component';

@Component({ selector: 'app-tiled-menu', template: '' })
export class StubTiledMenuComponent implements Partial<TiledMenuComponent> {
  @Input() tiles: TiledMenuTileData[] = [];
}

@Component({ selector: 'app-tiled-menu-tile', template: '' })
export class StubTiledMenuTileComponent implements Partial<TiledMenuTileComponent> {
  @Input() tileData!: TiledMenuTileData;
}

@NgModule({
  declarations: [StubTiledMenuComponent, StubTiledMenuTileComponent],
  exports: [StubTiledMenuComponent, StubTiledMenuTileComponent],
})
export class StubTiledMenuModule {}
