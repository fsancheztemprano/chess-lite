import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoleManagementDetailComponent } from './components/role-management-detail.component';

import { RoleManagementDetailRoutingModule } from './role-management-detail-routing.module';

@NgModule({
  declarations: [RoleManagementDetailComponent],
  imports: [CommonModule, RoleManagementDetailRoutingModule],
})
export class RoleManagementDetailModule {}
