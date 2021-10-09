import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationDialogModule } from '../../../../../../shared/modules/dialogs/modules/confirmation-dialog/confirmation-dialog.module';
import { TextInputDialogModule } from '../../../../../../shared/modules/dialogs/modules/input-dialog/modules/text-input-dialog/text-input-dialog.module';
import { RoleManagementTableComponent } from './components/role-management-table.component';
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
  ],
})
export class RoleManagementListModule {}
