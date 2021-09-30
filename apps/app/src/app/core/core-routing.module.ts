import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministrationGuard } from '../modules/administration/guards/administration.guard';
import { UserSettingsGuard } from '../modules/user-settings/guards/user-settings.guard';
import { CoreComponent } from './components/core/core.component';

const loadUserModule = () => import('../modules/user-settings/user-settings.module').then((m) => m.UserSettingsModule);

const loadAdministrationModule = () =>
  import('../modules/administration/administration.module').then((m) => m.AdministrationModule);

const loadAuthModule = () => import('../auth/auth.module').then((m) => m.AuthModule);

const loadHomeModule = () => import('../modules/home/home.module').then((m) => m.HomeModule);

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
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
      },
      {
        path: 'user',
        loadChildren: loadUserModule,
        canLoad: [UserSettingsGuard],
        canActivate: [UserSettingsGuard],
      },
      {
        path: 'administration',
        loadChildren: loadAdministrationModule,
        canLoad: [AdministrationGuard],
        canActivate: [AdministrationGuard],
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
