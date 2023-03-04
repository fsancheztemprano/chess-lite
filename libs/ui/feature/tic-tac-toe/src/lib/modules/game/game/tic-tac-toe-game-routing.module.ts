import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeGameComponent } from './components/tic-tac-toe-game.component';

const routes: Routes = [
  {
    path: '',
    component: TicTacToeGameComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeGameRoutingModule {}
