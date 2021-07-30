import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementAuthorityComponent } from './components/user-management-authority/user-management-authority.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementAuthorityComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementAuthorityRoutingModule {}
