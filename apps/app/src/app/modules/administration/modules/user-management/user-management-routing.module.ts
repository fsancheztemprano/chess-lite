import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesResolver } from '../role-management/resolvers/roles.resolver';

const loadUserManagementHomeModule = () =>
  import('./modules/home/user-management-home.module').then((m) => m.UserManagementHomeModule);

const loadUserManagementListModule = () =>
  import('./modules/list/user-management-list.module').then((m) => m.UserManagementListModule);

const loadUserManagementDetailModule = () =>
  import('./modules/detail/user-management-detail.module').then((m) => m.UserManagementDetailModule);

const loadUserManagementCreateModule = () =>
  import('./modules/create/user-management-create.module').then((m) => m.UserManagementCreateModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadUserManagementHomeModule,
  },
  {
    path: 'list',
    loadChildren: loadUserManagementListModule,
  },
  {
    path: 'create',
    loadChildren: loadUserManagementCreateModule,
    resolve: { roles: RolesResolver },
  },
  {
    path: 'edit/:userId',
    loadChildren: loadUserManagementDetailModule,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
