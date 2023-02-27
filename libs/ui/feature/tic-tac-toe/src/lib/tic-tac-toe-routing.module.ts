import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadTicTacToeHomeModule = () =>
  import('./modules/home/tic-tac-toe-home.module').then((m) => m.TicTacToeHomeModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadTicTacToeHomeModule,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeRoutingModule {}
