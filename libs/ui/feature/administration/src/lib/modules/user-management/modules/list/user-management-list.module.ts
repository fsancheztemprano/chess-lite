import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { UserManagementTableComponent } from './components/user-management-table/user-management-table.component';
import { UserManagementListRoutingModule } from './user-management-list-routing.module';

@NgModule({
  declarations: [UserManagementTableComponent],
  imports: [
    CommonModule,
    UserManagementListRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslocoModule,
    CoreCardViewModule,
  ],
})
export class UserManagementListModule {}
