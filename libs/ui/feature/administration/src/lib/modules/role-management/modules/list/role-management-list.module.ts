import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationDialogModule, CoreCardViewModule, TextInputDialogModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { RoleManagementTableComponent } from './components/table/role-management-table.component';
import { RoleManagementListRoutingModule } from './role-management-list-routing.module';

@NgModule({
  declarations: [RoleManagementTableComponent],
  imports: [
    CommonModule,
    RoleManagementListRoutingModule,
    ConfirmationDialogModule,
    TextInputDialogModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatPaginatorModule,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class RoleManagementListModule {}
