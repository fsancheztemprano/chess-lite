import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TicTacToeGameListComponent } from './components/tic-tac-toe-game-list.component';
import { TicTacToeGameListRoutingModule } from './tic-tac-toe-game-list-routing.module';

@NgModule({
  declarations: [TicTacToeGameListComponent],
  imports: [CommonModule, TicTacToeGameListRoutingModule],
})
export class TicTacToeGameListModule {}
