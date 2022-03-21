import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementProfileComponent } from './components/user-management-profile/user-management-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementProfileComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementProfileRoutingModule {}
