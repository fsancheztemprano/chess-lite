import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalSettingsModuleGuard } from './modules/global-settings/guards/global-settings-module.guard';
import { RoleManagementGuard } from './modules/role-management/guards/role-management.guard';
import { ServiceLogsGuard } from './modules/service-logs/guards/service-logs.guard';
import { UserManagementGuard } from './modules/user-management/guards/user-management.guard';

const loadAdministrationHomeModule = () =>
  import('./modules/home/administration-home.module').then((m) => m.AdministrationHomeModule);

const loadUserManagementModule = () =>
  import('./modules/user-management/user-management.module').then((m) => m.UserManagementModule);

const loadServiceLogsModule = () =>
  import('./modules/service-logs/service-logs.module').then((m) => m.ServiceLogsModule);

const loadGlobalSettingsModule = () =>
  import('./modules/global-settings/global-settings.module').then((m) => m.GlobalSettingsModule);

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
    canMatch: [UserManagementGuard],
    data: { breadcrumb: { label: 'administration.user-management.title', i18n: true } },
  },
  {
    path: 'service-logs',
    loadChildren: loadServiceLogsModule,
    canMatch: [ServiceLogsGuard],
    data: { breadcrumb: { label: 'administration.service-logs', i18n: true } },
  },
  {
    path: 'global-settings',
    loadChildren: loadGlobalSettingsModule,
    canMatch: [GlobalSettingsModuleGuard],
    data: { breadcrumb: { label: 'administration.global-settings.title', i18n: true } },
  },
  {
    path: 'role-management',
    loadChildren: loadRoleManagementModule,
    canMatch: [RoleManagementGuard],
    data: { breadcrumb: { label: 'administration.role-management.title', i18n: true } },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
