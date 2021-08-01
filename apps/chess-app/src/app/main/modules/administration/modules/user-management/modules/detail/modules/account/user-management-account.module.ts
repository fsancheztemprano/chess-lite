import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserManagementAccountComponent } from './components/user-management-account/user-management-account.component';

import { UserManagementAccountRoutingModule } from './user-management-account-routing.module';

@NgModule({
  declarations: [UserManagementAccountComponent],
  imports: [CommonModule, UserManagementAccountRoutingModule],
})
export class UserManagementAccountModule {}
