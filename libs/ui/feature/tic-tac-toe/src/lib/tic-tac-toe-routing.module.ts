import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ticTacToeGameResolver } from './modules/game/modules/game/resolvers/tic-tac-toe-game.resolver';

const loadTicTacToeHomeModule = () =>
  import('./modules/home/home/tic-tac-toe-home.module').then((m) => m.TicTacToeHomeModule);

const loadTicTacToeHomeSidebarModule = () =>
  import('./modules/home/home-sidebar/home-sidebar.module').then((m) => m.HomeSidebarModule);

const loadTicTacToeGameListModule = () =>
  import('./modules/games/modules/game-list/tic-tac-toe-game-list.module').then((m) => m.TicTacToeGameListModule);

const loadTicTacToeGameListSidebarModule = () =>
  import('./modules/games/modules/game-list-sidebar/tic-tac-toe-game-list-sidebar.module').then(
    (m) => m.TicTacToeGameListSidebarModule,
  );

const loadTicTacToeGameModule = () =>
  import('./modules/game/modules/game/tic-tac-toe-game.module').then((m) => m.TicTacToeGameModule);

const loadTicTacToeGameSidebarModule = () =>
  import('./modules/game/modules/game-sidebar/tic-tac-toe-game-sidebar.module').then(
    (m) => m.TicTacToeGameSidebarModule,
  );

const loadTicTacToeNewGameModule = () =>
  import('./modules/new-game/tic-tac-toe-new-game.module').then((m) => m.TicTacToeNewGameModule);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: loadTicTacToeHomeModule,
      },
      {
        path: '',
        loadChildren: loadTicTacToeHomeSidebarModule,
        pathMatch: 'full',
        outlet: 'sidebar',
      },
    ],
  },
  {
    path: 'games',
    data: { breadcrumb: { label: 'Games' } },
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: loadTicTacToeGameListModule,
            pathMatch: 'full',
          },
          {
            path: '',
            loadChildren: loadTicTacToeGameListSidebarModule,
            pathMatch: 'full',
            outlet: 'sidebar',
          },
        ],
        pathMatch: 'full',
      },
      {
        path: ':gameId',
        data: { breadcrumb: { label: 'Game X1' } },
        resolve: { game: ticTacToeGameResolver },
        children: [
          {
            path: '',
            loadChildren: loadTicTacToeGameModule,
          },
          {
            path: '',
            loadChildren: loadTicTacToeGameSidebarModule,
            outlet: 'sidebar',
          },
        ],
      },
    ],
  },
  {
    path: 'new-game',
    loadChildren: loadTicTacToeNewGameModule,
    data: { breadcrumb: { label: 'New Game' } },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToeRoutingModule {}
