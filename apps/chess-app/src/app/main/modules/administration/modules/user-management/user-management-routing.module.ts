import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadUserManagementHomeModule = () =>
  import('./modules/user-management-home/user-management-home.module').then((m) => m.UserManagementHomeModule);

const loadUserManagementDetailModule = () =>
  import('./modules/user-management-detail/user-management-detail.module').then((m) => m.UserManagementDetailModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadUserManagementHomeModule,
  },
  {
    path: ':username',
    loadChildren: loadUserManagementDetailModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
