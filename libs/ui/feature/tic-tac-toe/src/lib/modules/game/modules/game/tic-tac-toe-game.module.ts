import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoreCardViewModule, CoreInfoMessageComponent } from '@app/ui/shared/common';
import { IsMobileModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
import { ResizableMatIconDirective } from '../game-board/directives/resizable-mat-icon.directive';
import { TicTacToeGameComponent } from './components/tic-tac-toe-game.component';
import { TicTacToeGameRoutingModule } from './tic-tac-toe-game-routing.module';

@NgModule({
  declarations: [TicTacToeGameComponent],
  imports: [
    CommonModule,
    TicTacToeGameRoutingModule,
    CoreCardViewModule,
    IsMobileModule,
    MatIconModule,
    CoreInfoMessageComponent,
    MatButtonModule,
    TranslocoModule,
    ResizableMatIconDirective,
  ],
})
export class TicTacToeGameModule {}
