import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { FormlyMatAutocompleteModule, FormlyTranslocoModule } from '@app/ui/shared/custom-forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { TicTacToeNewGameComponent } from './components/tic-tac-toe-new-game.component';

import { TicTacToeNewGameRoutingModule } from './tic-tac-toe-new-game-routing.module';

@NgModule({
  declarations: [TicTacToeNewGameComponent],
  imports: [
    CommonModule,
    TicTacToeNewGameRoutingModule,
    TranslocoModule,
    CoreCardViewModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
    FormlyMatToggleModule,
    FormlyMatAutocompleteModule,
    FormlyTranslocoModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class TicTacToeNewGameModule {}
