import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { IsMobileModule } from '@app/ui/shared/core';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { TicTacToeHomeSidebarComponent } from './components/tic-tac-toe-home-sidebar.component';

import { HomeSidebarRoutingModule } from './home-sidebar-routing.module';

@NgModule({
  declarations: [TicTacToeHomeSidebarComponent],
  imports: [
    CommonModule,
    HomeSidebarRoutingModule,
    MatTabsModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
    FormlyMatToggleModule,
    IsMobileModule,
  ],
})
export class HomeSidebarModule {}
