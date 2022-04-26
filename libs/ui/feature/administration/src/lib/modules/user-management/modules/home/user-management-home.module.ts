import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TiledMenuModule } from '@app/ui/shared/common';
import { UserManagementHomeComponent } from './components/user-management-home/user-management-home.component';
import { UserManagementHomeRoutingModule } from './user-management-home-routing.module';

@NgModule({
  declarations: [UserManagementHomeComponent],
  imports: [CommonModule, UserManagementHomeRoutingModule, TiledMenuModule],
})
export class UserManagementHomeModule {}
