import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleManagementDetailComponent } from './components/role-management-detail/role-management-detail.component';

const routes: Routes = [{ path: '', component: RoleManagementDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleManagementDetailRoutingModule {}
