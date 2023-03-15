import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeGame } from '@app/ui/shared/domain';
import { TicTacToeGameComponent } from './components/tic-tac-toe-game.component';

const routes: Routes = [
  {
    path: '',
    component: TicTacToeGameComponent,
    pathMatch: 'full',
    data: {
      breadcrumb: {
        label: (data: { game: TicTacToeGame }) => `${data.game.playerO.username} vs ${data.game.playerX.username}`,
      },
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeGameRoutingModule {}
