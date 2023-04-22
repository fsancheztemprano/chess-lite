import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeNewGameComponent } from './components/tic-tac-toe-new-game.component';

const routes: Routes = [
  {
    path: '',
    component: TicTacToeNewGameComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeNewGameRoutingModule {}
