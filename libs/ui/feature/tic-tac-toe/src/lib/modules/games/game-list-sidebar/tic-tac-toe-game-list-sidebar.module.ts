import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { IsMobileModule } from '@app/ui/shared/core';
import { TicTacToeGameListSidebarComponent } from './components/tic-tac-toe-game-list-sidebar.component';
import { TicTacToeGameListSidebarRoutingModule } from './tic-tac-toe-game-list-sidebar-routing.module';

@NgModule({
  declarations: [TicTacToeGameListSidebarComponent],
  imports: [CommonModule, TicTacToeGameListSidebarRoutingModule, MatTabsModule, IsMobileModule],
})
export class TicTacToeGameListSidebarModule {}
