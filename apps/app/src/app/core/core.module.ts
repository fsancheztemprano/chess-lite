import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsMobileModule } from '../shared/modules/is-mobile/is-mobile.module';
import { CoreComponent } from './components/core/core.component';
import { CoreRoutingModule } from './core-routing.module';
import { CardViewModule } from './modules/card-view/card-view.module';
import { ContextMenuModule } from './modules/context-menu/context-menu.module';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { ToolbarModule } from './modules/toolbar/toolbar.module';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    IsMobileModule,
    CardViewModule,
    ContextMenuModule,
    ToolbarModule,
    SidenavModule,
  ],
})
export class CoreModule {}
