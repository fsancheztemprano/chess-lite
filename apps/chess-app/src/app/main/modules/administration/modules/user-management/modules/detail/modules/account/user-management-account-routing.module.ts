import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementAccountComponent } from './components/user-management-account/user-management-account.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementAccountComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementAccountRoutingModule {}
