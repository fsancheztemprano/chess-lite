import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TicTacToeGameListSidebarComponent } from './components/tic-tac-toe-game-list-sidebar.component';
import { TicTacToeGameListSidebarRoutingModule } from './tic-tac-toe-game-list-sidebar-routing.module';

@NgModule({
  declarations: [TicTacToeGameListSidebarComponent],
  imports: [CommonModule, TicTacToeGameListSidebarRoutingModule],
})
export class TicTacToeGameListSidebarModule {}
