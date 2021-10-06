import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleManagementListComponent } from './components/role-management-list.component';

const routes: Routes = [{ path: '', component: RoleManagementListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagementListRoutingModule {}
