import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementDetailComponent } from './components/user-management-detail/user-management-detail.component';
import { UserManagementDetailGuard } from './guards/user-management-detail.guard';
import { UserManagementDetailResolver } from './resolvers/user-management-detail.resolver';

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
    path: ':userId',
    component: UserManagementDetailComponent,
    canActivate: [UserManagementDetailGuard],
    canDeactivate: [UserManagementDetailGuard],
    resolve: { user: UserManagementDetailResolver },
    data: { breadcrumb: (data: { user: { username: string } }) => `${data.user.username}` },
    children: [
      {
        path: 'profile',
        loadChildren: loadUserManagementProfileModule,
        data: { breadcrumb: 'Profile', parentOffset: 1 },
      },
      {
        path: 'authority',
        loadChildren: loadUserManagementAuthorityModule,
        data: { breadcrumb: 'Authority' },
      },
      {
        path: 'account',
        loadChildren: loadUserManagementDeleteModule,
        data: { breadcrumb: 'Account' },
      },
      {
        path: 'preferences',
        loadChildren: loadUserManagementPreferencesModule,
        data: { breadcrumb: 'Preferences' },
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: '**', redirectTo: 'profile' },
    ],
  },
  { path: '', redirectTo: '/administration/user-management' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementDetailRoutingModule {}
