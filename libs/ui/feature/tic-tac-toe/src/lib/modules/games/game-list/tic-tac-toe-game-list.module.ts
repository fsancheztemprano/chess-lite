import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { TicTacToeGameListComponent } from './components/tic-tac-toe-game-list.component';
import { TicTacToeGameListRoutingModule } from './tic-tac-toe-game-list-routing.module';

@NgModule({
  declarations: [TicTacToeGameListComponent],
  imports: [
    CommonModule,
    TicTacToeGameListRoutingModule,
    CoreCardViewModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class TicTacToeGameListModule {}
