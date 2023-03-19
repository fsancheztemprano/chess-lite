import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CoreInfoMessageComponent, DurationPipe } from '@app/ui/shared/common';
import { IsMobileModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TicTacToeGameBoardComponent } from '../game-board/components/tic-tac-toe-game-board.component';
import { TicTacToeGameSidebarInfoComponent } from './components/tic-tac-toe-game-sidebar-info.component';
import { TicTacToeGameSidebarMovesComponent } from './components/tic-tac-toe-game-sidebar-moves.component';
import { TicTacToeGameSidebarComponent } from './components/tic-tac-toe-game-sidebar.component';
import { TicTacToeGameSidebarRoutingModule } from './tic-tac-toe-game-sidebar-routing.module';

@NgModule({
  declarations: [TicTacToeGameSidebarComponent, TicTacToeGameSidebarInfoComponent, TicTacToeGameSidebarMovesComponent],
  imports: [
    CommonModule,
    TicTacToeGameSidebarRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    IsMobileModule,
    TranslocoModule,
    DurationPipe,
    TicTacToeGameBoardComponent,
    CoreInfoMessageComponent,
  ],
})
export class TicTacToeGameSidebarModule {}
