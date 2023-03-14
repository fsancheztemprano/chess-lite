import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { IsMobileModule } from '@app/ui/shared/core';
import { FormlyTranslocoModule } from '@app/ui/shared/custom-forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { TicTacToeGameListSidebarComponent } from './components/tic-tac-toe-game-list-sidebar.component';
import { TicTacToeGameListSidebarRoutingModule } from './tic-tac-toe-game-list-sidebar-routing.module';

@NgModule({
  declarations: [TicTacToeGameListSidebarComponent],
  imports: [
    CommonModule,
    TicTacToeGameListSidebarRoutingModule,
    MatTabsModule,
    IsMobileModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
    FormlyMatToggleModule,
    FormlyTranslocoModule,
    TranslocoModule,
  ],
})
export class TicTacToeGameListSidebarModule {}
