import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementDetailComponent } from './components/user-management-detail/user-management-detail.component';
import { UserManagementDetailGuard } from './guards/user-management-detail.guard';

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
    canActivate: [UserManagementDetailGuard],
    canDeactivate: [UserManagementDetailGuard],
    children: [
      {
        path: 'profile',
        loadChildren: loadUserManagementProfileModule,
      },
      {
        path: 'authority',
        loadChildren: loadUserManagementAuthorityModule,
      },
      {
        path: 'account',
        loadChildren: loadUserManagementDeleteModule,
      },
      {
        path: 'preferences',
        loadChildren: loadUserManagementPreferencesModule,
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
