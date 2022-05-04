import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesResolver } from '../role-management/resolvers/roles.resolver';
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
    resolve: { roles: RolesResolver },
    children: [
      {
        path: 'general',
        loadChildren: loadGlobalSettingsGeneralModule,
        data: { breadcrumb: { i18n: 'administration.global-settings.general-settings', parentOffset: 1 } },
      },
      {
        path: 'access-restrictions',
        loadChildren: loadGlobalSettingsAccessRestrictionsModule,
        data: { breadcrumb: { i18n: 'administration.global-settings.access-restrictions' } },
      },
      { path: '', redirectTo: 'general' },
      { path: '**', redirectTo: 'general' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSettingsRoutingModule {}
