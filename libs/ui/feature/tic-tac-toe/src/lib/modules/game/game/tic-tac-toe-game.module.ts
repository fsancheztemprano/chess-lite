import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TicTacToeGameComponent } from './components/tic-tac-toe-game.component';
import { TicTacToeGameRoutingModule } from './tic-tac-toe-game-routing.module';

@NgModule({
  declarations: [TicTacToeGameComponent],
  imports: [CommonModule, TicTacToeGameRoutingModule],
})
export class TicTacToeGameModule {}
