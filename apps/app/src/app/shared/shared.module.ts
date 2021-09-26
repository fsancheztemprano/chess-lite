import { NgModule } from '@angular/core';
import { FormErrorModule } from './components/form-error/form-error.component';
import { NgLetModule } from './directives/ng-let.directive';
import { TiledMenuModule } from './modules/tiled-menu/tiled-menu.module';
import { IsMobileModule } from './pipes/is-mobile.pipe';

@NgModule({
  imports: [IsMobileModule, NgLetModule, FormErrorModule, TiledMenuModule],
  exports: [IsMobileModule, NgLetModule, FormErrorModule, TiledMenuModule],
})
export class SharedModule {}
