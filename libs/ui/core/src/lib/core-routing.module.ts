import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationGuard } from '@app/ui/feature/administration';
import { AuthGuard } from '@app/ui/feature/authentication';
import { UserSettingsGuard } from '@app/ui/feature/user';
import { CoreComponent } from './components/core/core.component';

const loadUserModule = () => import('@app/ui/feature/user').then((m) => m.UserModule);

const loadAdministrationModule = () => import('@app/ui/feature/administration').then((m) => m.AdministrationModule);

const loadAuthModule = () => import('@app/ui/feature/authentication').then((m) => m.AuthenticationModule);

const loadHomeModule = () => import('@app/ui/feature/home').then((m) => m.HomeModule);

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
