import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TicTacToeGameSidebarComponent } from './components/tic-tac-toe-game-sidebar.component';
import { TicTacToeGameSidebarRoutingModule } from './tic-tac-toe-game-sidebar-routing.module';

@NgModule({
  declarations: [TicTacToeGameSidebarComponent],
  imports: [CommonModule, TicTacToeGameSidebarRoutingModule],
})
export class TicTacToeGameSidebarModule {}
