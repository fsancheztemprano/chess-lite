import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementDetailComponent } from './components/user-management-detail/user-management-detail.component';

const loadUserManagementProfileModule = () =>
  import('./modules/profile/user-management-profile.module').then((m) => m.UserManagementProfileModule);

const loadUserManagementDeleteModule = () =>
  import('./modules/account/user-management-account.module').then((m) => m.UserManagementAccountModule);

const loadUserManagementAuthorityModule = () =>
  import('./modules/authority/user-management-authority.module').then((m) => m.UserManagementAuthorityModule);

const loadUserManagementPreferencesModule = () =>
  import('./modules/preferences/user-management-preferences.module').then((m) => m.UserManagementPreferencesModule);

const routes: Routes = [
  {
    path: '',
    component: UserManagementDetailComponent,
    children: [
      {
        path: 'profile',
        loadChildren: loadUserManagementProfileModule,
        data: { breadcrumb: { i18n: 'administration.user-management.profile', parentOffset: 1 } },
      },
      {
        path: 'authority',
        loadChildren: loadUserManagementAuthorityModule,
        data: { breadcrumb: { i18n: 'administration.user-management.authority' } },
      },
      {
        path: 'account',
        loadChildren: loadUserManagementDeleteModule,
        data: { breadcrumb: { i18n: 'administration.user-management.account' } },
      },
      {
        path: 'preferences',
        loadChildren: loadUserManagementPreferencesModule,
        data: { breadcrumb: { i18n: 'administration.user-management.preferences' } },
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: '**', redirectTo: 'profile' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementDetailRoutingModule {}
