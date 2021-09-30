import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementGuard } from './modules/user-management/guards/user-management.guard';

const loadAdministrationHomeModule = () =>
  import('./modules/home/administration-home.module').then((m) => m.AdministrationHomeModule);

const loadUserManagementModule = () =>
  import('./modules/user-management/user-management.module').then((m) => m.UserManagementModule);

const loadServiceLogsModule = () =>
  import('./modules/service-logs/service-logs.module').then((m) => m.ServiceLogsModule);

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
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
