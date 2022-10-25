import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TiledMenuModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { UserManagementHomeComponent } from './components/user-management-home/user-management-home.component';
import { UserManagementHomeRoutingModule } from './user-management-home-routing.module';

@NgModule({
  declarations: [UserManagementHomeComponent],
  imports: [CommonModule, UserManagementHomeRoutingModule, TiledMenuModule, TranslocoModule],
})
export class UserManagementHomeModule {}
