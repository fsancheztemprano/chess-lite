import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeGameListComponent } from './components/tic-tac-toe-game-list.component';

const routes: Routes = [
  {
    path: '',
    component: TicTacToeGameListComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeGameListRoutingModule {}
