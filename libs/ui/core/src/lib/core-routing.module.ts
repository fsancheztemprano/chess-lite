import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { isValidToken } from '@app/ui/shared/app';
import { CurrentUserRelations, TokenKeys } from '@app/ui/shared/domain';
import { AdministrationGuard } from '@app/ui/shared/feature/administration';
import { TicTacToeGuard } from '@app/ui/shared/feature/tic-tac-toe';
import { HalFormService } from '@hal-form-client';
import { CoreComponent } from './components/core/core.component';

const loadUserModule = () => import('@app/ui/feature/user').then((m) => m.UserModule);

const loadAdministrationModule = () => import('@app/ui/feature/administration').then((m) => m.AdministrationModule);

const loadAuthModule = () => import('@app/ui/feature/authentication').then((m) => m.AuthenticationModule);

const loadHomeModule = () => import('@app/ui/feature/home').then((m) => m.HomeModule);

const loadTicTacToeModule = () => import('@app/ui/feature/tic-tac-toe').then((m) => m.TicTacToeModule);

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    data: { breadcrumb: { icon: 'home' } },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: loadHomeModule,
      },
      {
        path: 'auth',
        loadChildren: loadAuthModule,
        canMatch: [
          () => !isValidToken(localStorage.getItem(TokenKeys.TOKEN) || '') || inject(Router).createUrlTree(['']),
        ],
        data: { breadcrumb: { label: 'authentication.title', i18n: true } },
      },
      {
        path: 'user',
        loadChildren: loadUserModule,
        canMatch: [() => inject(HalFormService).hasLink(CurrentUserRelations.CURRENT_USER_REL)],
        data: { breadcrumb: { label: 'user-settings.title', i18n: true } },
      },
      {
        path: 'administration',
        loadChildren: loadAdministrationModule,
        canMatch: [AdministrationGuard],
        data: { breadcrumb: { label: 'administration.title', i18n: true } },
      },
      {
        path: 'tic-tac-toe',
        loadChildren: loadTicTacToeModule,
        canMatch: [TicTacToeGuard],
        data: { breadcrumb: { label: 'tic-tac-toe.title', i18n: true } },
      },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
