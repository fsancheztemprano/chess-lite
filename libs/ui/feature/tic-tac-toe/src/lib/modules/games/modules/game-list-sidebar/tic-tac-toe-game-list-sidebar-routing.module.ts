import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeGameListSidebarComponent } from './components/tic-tac-toe-game-list-sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: TicTacToeGameListSidebarComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeGameListSidebarRoutingModule {}
