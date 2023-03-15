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
import { TicTacToeGameSidebarComponent } from './components/tic-tac-toe-game-sidebar.component';
import { TicTacToeGameSidebarRoutingModule } from './tic-tac-toe-game-sidebar-routing.module';
import { TicTacToeGameSidebarInfoComponent } from './components/tic-tac-toe-game-sidebar-info.component';
import { TicTacToeGameSidebarMovesComponent } from './components/tic-tac-toe-game-sidebar-moves.component';

@NgModule({
  declarations: [TicTacToeGameSidebarComponent, TicTacToeGameSidebarInfoComponent, TicTacToeGameSidebarMovesComponent],
  imports: [
    CommonModule,
    TicTacToeGameSidebarRoutingModule,
    MatTabsModule,
    IsMobileModule,
    ReactiveFormsModule,
    TranslocoModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
    FormlyMatToggleModule,
    FormlyTranslocoModule,
  ],
})
export class TicTacToeGameSidebarModule {}
