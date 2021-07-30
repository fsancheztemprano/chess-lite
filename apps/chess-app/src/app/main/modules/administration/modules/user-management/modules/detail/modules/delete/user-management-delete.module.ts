import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserManagementDeleteComponent } from './components/user-management-delete/user-management-delete.component';

import { UserManagementDeleteRoutingModule } from './user-management-delete-routing.module';

@NgModule({
  declarations: [UserManagementDeleteComponent],
  imports: [CommonModule, UserManagementDeleteRoutingModule],
})
export class UserManagementDeleteModule {}
