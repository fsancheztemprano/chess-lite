import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeHomeComponent } from './components/tic-tac-toe-home.component';

const routes: Routes = [
  {
    path: '',
    component: TicTacToeHomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeHomeRoutingModule {}
