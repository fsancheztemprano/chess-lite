import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadUserManagementHomeModule = () =>
  import('./modules/user-management-home/user-management-home.module').then((m) => m.UserManagementHomeModule);

const loadUserManagementDetailModule = () =>
  import('./modules/user-management-detail/user-management-detail.module').then((m) => m.UserManagementDetailModule);

const loadUserManagementCreateModule = () =>
  import('./modules/user-management-create/user-management-create.module').then((m) => m.UserManagementCreateModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadUserManagementHomeModule,
  },
  {
    path: 'create',
    loadChildren: loadUserManagementCreateModule,
  },
  {
    path: 'edit/:username',
    loadChildren: loadUserManagementDetailModule,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
