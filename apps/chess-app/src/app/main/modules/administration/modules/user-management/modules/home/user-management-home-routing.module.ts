import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementHomeComponent } from './components/user-management-home/user-management-home.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementHomeRoutingModule {}
