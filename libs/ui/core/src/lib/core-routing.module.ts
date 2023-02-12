import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/ui/feature/authentication';
import { UserSettingsGuard } from '@app/ui/feature/user';
import { AdministrationGuard } from '@app/ui/shared/feature/administration';
import { CoreComponent } from './components/core/core.component';

const loadUserModule = () => import('@app/ui/feature/user').then((m) => m.UserModule);

const loadAdministrationModule = () => import('@app/ui/feature/administration').then((m) => m.AdministrationModule);

const loadAuthModule = () => import('@app/ui/feature/authentication').then((m) => m.AuthenticationModule);

const loadHomeModule = () => import('@app/ui/feature/home').then((m) => m.HomeModule);

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
        canMatch: [AuthGuard],
        data: { breadcrumb: { label: 'authentication.title', i18n: true } },
      },
      {
        path: 'user',
        loadChildren: loadUserModule,
        canMatch: [UserSettingsGuard],
        data: { breadcrumb: { label: 'user-settings.title', i18n: true } },
      },
      {
        path: 'administration',
        loadChildren: loadAdministrationModule,
        canMatch: [AdministrationGuard],
        data: { breadcrumb: { label: 'administration.title', i18n: true } },
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
