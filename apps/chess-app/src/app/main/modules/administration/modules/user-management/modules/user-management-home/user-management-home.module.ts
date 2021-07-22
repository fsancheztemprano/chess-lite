import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserManagementHomeComponent } from './components/user-management-home/user-management-home.component';
import { UserManagementTableComponent } from './components/user-management-table/user-management-table.component';

import { UserManagementHomeRoutingModule } from './user-management-home-routing.module';

@NgModule({
  declarations: [UserManagementHomeComponent, UserManagementTableComponent],
  imports: [CommonModule, UserManagementHomeRoutingModule, MatTableModule],
})
export class UserManagementHomeModule {}
