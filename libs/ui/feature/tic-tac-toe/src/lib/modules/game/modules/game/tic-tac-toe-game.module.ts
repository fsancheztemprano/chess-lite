import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCardViewModule, CoreInfoMessageComponent } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { TicTacToeGameBoardComponent } from '../game-board/components/tic-tac-toe-game-board.component';
import { TicTacToeGameComponent } from './components/tic-tac-toe-game.component';
import { TicTacToeGameRoutingModule } from './tic-tac-toe-game-routing.module';

@NgModule({
  declarations: [TicTacToeGameComponent],
  imports: [
    CommonModule,
    TicTacToeGameRoutingModule,
    CoreCardViewModule,
    CoreInfoMessageComponent,
    TranslocoModule,
    TicTacToeGameBoardComponent,
  ],
})
export class TicTacToeGameModule {}
