import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserManagementAuthorityComponent } from './components/user-management-authority/user-management-authority.component';

import { UserManagementAuthorityRoutingModule } from './user-management-authority-routing.module';

@NgModule({
  declarations: [UserManagementAuthorityComponent],
  imports: [CommonModule, UserManagementAuthorityRoutingModule],
})
export class UserManagementAuthorityModule {}
