import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementDeleteComponent } from './components/user-management-delete/user-management-delete.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementDeleteComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementDeleteRoutingModule {}
