import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeGameSidebarComponent } from './components/tic-tac-toe-game-sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: TicTacToeGameSidebarComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeGameSidebarRoutingModule {}
