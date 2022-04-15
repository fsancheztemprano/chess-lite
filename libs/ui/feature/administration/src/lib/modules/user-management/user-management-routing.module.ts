import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesResolver } from '../role-management/resolvers/roles.resolver';
import { UserManagementDetailGuard } from './modules/detail/guards/user-management-detail.guard';
import { UserManagementDetailResolver } from './modules/detail/resolvers/user-management-detail.resolver';

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
    path: 'users',
    children: [
      {
        path: '',
        loadChildren: loadUserManagementListModule,
        data: { breadcrumb: 'Users' },
        pathMatch: 'full',
      },
      {
        path: ':userId',
        loadChildren: loadUserManagementDetailModule,
        canActivate: [UserManagementDetailGuard],
        canDeactivate: [UserManagementDetailGuard],
        resolve: { user: UserManagementDetailResolver },
        data: { breadcrumb: (data: { user: { username: string } }) => `${data.user.username}` },
      },
    ],
  },
  {
    path: 'create',
    loadChildren: loadUserManagementCreateModule,
    resolve: { roles: RolesResolver },
    data: { breadcrumb: 'New User' },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
