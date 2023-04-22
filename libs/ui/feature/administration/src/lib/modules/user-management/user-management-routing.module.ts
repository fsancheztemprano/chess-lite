import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { filter, take } from 'rxjs';
import { RoleManagementService } from '../role-management/services/role-management.service';
import { UserManagementDetailGuard } from './modules/detail/guards/user-management-detail.guard';
import { UserManagementDetailService } from './modules/detail/services/user-management-detail.service';

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
    data: { breadcrumb: { label: 'administration.user-management.users', i18n: true } },
    children: [
      {
        path: '',
        loadChildren: loadUserManagementListModule,
        pathMatch: 'full',
      },
      {
        path: ':userId',
        loadChildren: loadUserManagementDetailModule,
        canActivate: [UserManagementDetailGuard],
        canDeactivate: [UserManagementDetailGuard],
        resolve: {
          user: () =>
            inject(UserManagementDetailService).user$.pipe(
              take(1),
              filter((user) => !!user?.username?.length),
            ),
        },
        data: { breadcrumb: { label: (data: { user: { username: string } }) => `${data.user.username}` } },
      },
    ],
  },
  {
    path: 'create',
    loadChildren: loadUserManagementCreateModule,
    resolve: { roles: () => inject(RoleManagementService).fetchRoles({ size: 1000 }) },
    data: { breadcrumb: { label: 'administration.user-management.new-user', i18n: true } },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
