import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleManagementGuard } from './modules/role-management/guards/role-management.guard';
import { UserManagementGuard } from './modules/user-management/guards/user-management.guard';

const loadAdministrationHomeModule = () =>
  import('./modules/home/administration-home.module').then((m) => m.AdministrationHomeModule);

const loadUserManagementModule = () =>
  import('./modules/user-management/user-management.module').then((m) => m.UserManagementModule);

const loadServiceLogsModule = () =>
  import('./modules/service-logs/service-logs.module').then((m) => m.ServiceLogsModule);

const loadRoleManagementModule = () =>
  import('./modules/role-management/role-management.module').then((m) => m.RoleManagementModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadAdministrationHomeModule,
    pathMatch: 'full',
  },
  {
    path: 'user-management',
    loadChildren: loadUserManagementModule,
    canLoad: [UserManagementGuard],
    canActivate: [UserManagementGuard],
  },
  {
    path: 'service-logs',
    loadChildren: loadServiceLogsModule,
  },
  {
    path: 'role-management',
    loadChildren: loadRoleManagementModule,
    canLoad: [RoleManagementGuard],
    canActivate: [RoleManagementGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
