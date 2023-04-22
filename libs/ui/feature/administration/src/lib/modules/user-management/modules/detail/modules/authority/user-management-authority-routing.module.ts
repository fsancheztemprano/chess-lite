import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorityManagementService } from '../../../../../role-management/services/authority-management.service';
import { RoleManagementService } from '../../../../../role-management/services/role-management.service';
import { UserManagementAuthorityComponent } from './components/user-management-authority/user-management-authority.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementAuthorityComponent,
    resolve: {
      roles: () => inject(RoleManagementService).fetchRoles({ size: 1000 }),
      authorities: () => inject(AuthorityManagementService).getAllAuthorities(),
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementAuthorityRoutingModule {}
