import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { UserManagementDetailComponent } from './components/user-management-detail/user-management-detail.component';
import { UserManagementDetailRoutingModule } from './user-management-detail-routing.module';

@NgModule({
  declarations: [UserManagementDetailComponent],
  imports: [CommonModule, UserManagementDetailRoutingModule, CoreCardViewModule, TranslocoModule],
})
export class UserManagementDetailModule {}
