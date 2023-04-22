import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleResolver } from './resolvers/role.resolver';
import { AuthorityManagementService } from './services/authority-management.service';

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
    resolve: { role: roleResolver, authorities: () => inject(AuthorityManagementService).getAllAuthorities() },
    data: { breadcrumb: { label: (data: { role: { name: string } }) => `${data.role.name}` } },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagementRoutingModule {}
