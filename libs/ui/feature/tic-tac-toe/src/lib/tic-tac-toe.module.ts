import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TicTacToeRoutingModule } from './tic-tac-toe-routing.module';

@NgModule({
  imports: [CommonModule, TicTacToeRoutingModule],
})
export class TicTacToeModule {}
