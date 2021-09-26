import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementTableComponent } from './components/user-management-table/user-management-table.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementTableComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementListRoutingModule {}
