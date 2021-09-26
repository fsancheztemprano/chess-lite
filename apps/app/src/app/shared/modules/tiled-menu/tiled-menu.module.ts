import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgLetModule } from '../../directives/ng-let.directive';
import { IsMobileModule } from '../../pipes/is-mobile.pipe';
import { TiledMenuTileComponent } from './components/tiled-menu-tile/tiled-menu-tile.component';
import { TiledMenuComponent } from './components/tiled-menu/tiled-menu.component';

@NgModule({
  declarations: [TiledMenuComponent, TiledMenuTileComponent],
  imports: [CommonModule, MatIconModule, RouterModule, IsMobileModule, NgLetModule],
  exports: [TiledMenuComponent],
})
export class TiledMenuModule {}
