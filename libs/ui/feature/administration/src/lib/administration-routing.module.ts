import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  GlobalSettingsRelations,
  RoleManagementRelations,
  ServiceLogsRelations,
  UserManagementRelations,
} from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';

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

const loadThemeModule = () =>
  import('./modules/theme/administration-theme.module').then((m) => m.AdministrationThemeModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadAdministrationHomeModule,
    pathMatch: 'full',
  },
  {
    path: 'user-management',
    loadChildren: loadUserManagementModule,
    canMatch: [() => inject(AdministrationService).hasEmbeddedObject(UserManagementRelations.USER_MANAGEMENT_REL)],
    data: { breadcrumb: { label: 'administration.user-management.title', i18n: true } },
  },
  {
    path: 'service-logs',
    loadChildren: loadServiceLogsModule,
    canMatch: [() => inject(AdministrationService).hasLink(ServiceLogsRelations.SERVICE_LOGS_REL)],
    data: { breadcrumb: { label: 'administration.service-logs', i18n: true } },
  },
  {
    path: 'global-settings',
    loadChildren: loadGlobalSettingsModule,
    canMatch: [() => inject(AdministrationService).hasLink(GlobalSettingsRelations.GLOBAL_SETTINGS_REL)],
    data: { breadcrumb: { label: 'administration.global-settings.title', i18n: true } },
  },
  {
    path: 'role-management',
    loadChildren: loadRoleManagementModule,
    canMatch: [() => inject(AdministrationService).hasEmbeddedObject(RoleManagementRelations.ROLE_MANAGEMENT_REL)],
    data: { breadcrumb: { label: 'administration.role-management.title', i18n: true } },
  },
  {
    path: 'theme',
    loadChildren: loadThemeModule,
    data: { breadcrumb: { label: 'administration.theme.title', i18n: true } },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
