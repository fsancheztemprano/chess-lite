import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TiledMenuModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { TicTacToeHomeComponent } from './components/tic-tac-toe-home.component';

import { TicTacToeHomeRoutingModule } from './tic-tac-toe-home-routing.module';

@NgModule({
  declarations: [TicTacToeHomeComponent],
  imports: [CommonModule, TicTacToeHomeRoutingModule, TiledMenuModule, TranslocoModule],
})
export class TicTacToeHomeModule {}
