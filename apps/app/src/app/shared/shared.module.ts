import { NgModule } from '@angular/core';
import { FormErrorModule } from './modules/form-error/form-error.module';
import { IsMobileModule } from './modules/is-mobile/is-mobile.module';
import { NgLetModule } from './modules/ng-let/ng-let.module';
import { TiledMenuModule } from './modules/tiled-menu/tiled-menu.module';

@NgModule({
  imports: [IsMobileModule, NgLetModule, FormErrorModule, TiledMenuModule],
  exports: [IsMobileModule, NgLetModule, FormErrorModule, TiledMenuModule],
})
export class SharedModule {}
