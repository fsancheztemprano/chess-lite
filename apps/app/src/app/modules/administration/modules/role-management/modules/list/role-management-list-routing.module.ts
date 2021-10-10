import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleManagementTableComponent } from './components/role-management-table/role-management-table.component';

const routes: Routes = [{ path: '', component: RoleManagementTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagementListRoutingModule {}
