import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { UserManagementDetailComponent } from './components/user-management-detail/user-management-detail.component';

import { UserManagementDetailRoutingModule } from './user-management-detail-routing.module';

@NgModule({
  declarations: [UserManagementDetailComponent],
  imports: [CommonModule, UserManagementDetailRoutingModule, MatTabsModule, MatCardModule],
})
export class UserManagementDetailModule {}
