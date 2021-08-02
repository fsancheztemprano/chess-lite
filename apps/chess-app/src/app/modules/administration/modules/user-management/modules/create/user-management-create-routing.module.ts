import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementCreateComponent } from './components/user-management-create/user-management-create.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementCreateComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementCreateRoutingModule {}
