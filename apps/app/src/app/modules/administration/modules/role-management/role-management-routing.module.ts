import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadRoleManagementListModule = () =>
  import('./modules/list/role-management-list.module').then((m) => m.RoleManagementListModule);

const loadRoleManagementDetailModule = () =>
  import('./modules/detail/role-management-detail.module').then((m) => m.RoleManagementDetailModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadRoleManagementListModule,
  },
  {
    path: ':roleId',
    loadChildren: loadRoleManagementDetailModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagementRoutingModule {}
