import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementDetailComponent } from './components/user-management-detail/user-management-detail.component';

const loadUserManagementProfileModule = () =>
  import('./modules/user-management-profile/user-management-profile.module').then((m) => m.UserManagementProfileModule);

const loadUserManagementDeleteModule = () =>
  import('./modules/user-management-delete/user-management-delete.module').then((m) => m.UserManagementDeleteModule);

const loadUserManagementAuthorityModule = () =>
  import('./modules/user-management-authority/user-management-authority.module').then(
    (m) => m.UserManagementAuthorityModule,
  );

const routes: Routes = [
  {
    path: '',
    component: UserManagementDetailComponent,
    children: [
      {
        path: 'profile',
        loadChildren: loadUserManagementProfileModule,
      },
      {
        path: 'authority',
        loadChildren: loadUserManagementAuthorityModule,
      },
      {
        path: 'delete',
        loadChildren: loadUserManagementDeleteModule,
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: '**', redirectTo: 'profile' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementDetailRoutingModule {}
