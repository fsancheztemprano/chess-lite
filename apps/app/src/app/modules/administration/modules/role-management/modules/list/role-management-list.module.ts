import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoleManagementListComponent } from './components/role-management-list.component';

import { RoleManagementListRoutingModule } from './role-management-list-routing.module';

@NgModule({
  declarations: [RoleManagementListComponent],
  imports: [CommonModule, RoleManagementListRoutingModule],
})
export class RoleManagementListModule {}
