import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleManagementService } from '../role-management/services/role-management.service';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';
import { GlobalSettingsGuard } from './guards/global-settings.guard';

const loadGlobalSettingsGeneralModule = () =>
  import('./modules/general/global-settings-general.module').then((m) => m.GlobalSettingsGeneralModule);

const loadGlobalSettingsAccessRestrictionsModule = () =>
  import('./modules/access-restrictions/global-settings-access-restrictions.module').then(
    (m) => m.GlobalSettingsAccessRestrictionsModule,
  );

const routes: Routes = [
  {
    path: '',
    component: GlobalSettingsComponent,
    canActivate: [GlobalSettingsGuard],
    canDeactivate: [GlobalSettingsGuard],
    resolve: { roles: () => inject(RoleManagementService).fetchRoles({ size: 1000 }) },
    children: [
      {
        path: 'general',
        loadChildren: loadGlobalSettingsGeneralModule,
        data: { breadcrumb: { label: 'administration.global-settings.general-settings', i18n: true, parentOffset: 1 } },
      },
      {
        path: 'access-restrictions',
        loadChildren: loadGlobalSettingsAccessRestrictionsModule,
        data: { breadcrumb: { label: 'administration.global-settings.access-restrictions', i18n: true } },
      },
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full',
      },
      { path: '**', redirectTo: 'general' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSettingsRoutingModule {}
