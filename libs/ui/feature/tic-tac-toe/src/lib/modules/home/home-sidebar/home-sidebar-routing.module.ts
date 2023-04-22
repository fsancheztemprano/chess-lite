import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeHomeSidebarComponent } from './components/tic-tac-toe-home-sidebar.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TicTacToeHomeSidebarComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSidebarRoutingModule {}
