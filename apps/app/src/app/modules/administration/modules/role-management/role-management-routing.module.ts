import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthoritiesResolver } from './resolvers/authorities.resolver';
import { RoleResolver } from './resolvers/role.resolver';

const loadRoleManagementListModule = () =>
  import('./modules/list/role-management-list.module').then((m) => m.RoleManagementListModule);

const loadRoleManagementDetailModule = () =>
  import('./modules/detail/role-management-detail.module').then((m) => m.RoleManagementDetailModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadRoleManagementListModule,
    data: { breadcrumb: 'Roles' },
  },
  {
    path: ':roleId',
    loadChildren: loadRoleManagementDetailModule,
    resolve: { role: RoleResolver, authorities: AuthoritiesResolver },
    data: { breadcrumb: (data: { role: { name: string } }) => `${data.role.name}` },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagementRoutingModule {}
