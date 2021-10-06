import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadRoleManagementHomeModule = () =>
  import('./modules/home/role-management-home.module').then((m) => m.RoleManagementHomeModule);

const loadRoleManagementListModule = () =>
  import('./modules/list/role-management-list.module').then((m) => m.RoleManagementListModule);

const loadRoleManagementDetailModule = () =>
  import('./modules/detail/role-management-detail.module').then((m) => m.RoleManagementDetailModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadRoleManagementHomeModule,
  },
  {
    path: 'list',
    loadChildren: loadRoleManagementListModule,
  },
  {
    path: 'edit/:roleId',
    loadChildren: loadRoleManagementDetailModule,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagementRoutingModule {}
