import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../../../libs/ui/authorization/src/lib/guards/auth.guard';
import { AdministrationGuard } from '../modules/administration/guards/administration.guard';
import { UserSettingsGuard } from '../modules/user-settings/guards/user-settings.guard';
import { CoreComponent } from './components/core/core.component';

const loadUserModule = () => import('../modules/user-settings/user-settings.module').then((m) => m.UserSettingsModule);

const loadAdministrationModule = () =>
  import('../modules/administration/administration.module').then((m) => m.AdministrationModule);

const loadAuthModule = () => import('@app/ui/authorization').then((m) => m.AuthorizationModule);

const loadHomeModule = () => import('../modules/home/home.module').then((m) => m.HomeModule);

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: '',
        loadChildren: loadHomeModule,
        pathMatch: 'full',
      },
      {
        path: 'auth',
        loadChildren: loadAuthModule,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Authentication' },
      },
      {
        path: 'user',
        loadChildren: loadUserModule,
        canLoad: [UserSettingsGuard],
        canActivate: [UserSettingsGuard],
        data: { breadcrumb: 'User Settings' },
      },
      {
        path: 'administration',
        loadChildren: loadAdministrationModule,
        canLoad: [AdministrationGuard],
        canActivate: [AdministrationGuard],
        data: { breadcrumb: 'Administration' },
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
