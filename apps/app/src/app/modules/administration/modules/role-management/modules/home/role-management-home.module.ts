import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoleManagementHomeComponent } from './components/role-management-home.component';

import { RoleManagementHomeRoutingModule } from './role-management-home-routing.module';

@NgModule({
  declarations: [RoleManagementHomeComponent],
  imports: [CommonModule, RoleManagementHomeRoutingModule],
})
export class RoleManagementHomeModule {}
