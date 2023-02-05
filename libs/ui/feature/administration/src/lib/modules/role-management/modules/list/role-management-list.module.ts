import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { CoreCardViewModule, DialogsModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { RoleManagementTableComponent } from './components/table/role-management-table.component';
import { RoleManagementListRoutingModule } from './role-management-list-routing.module';

@NgModule({
  declarations: [RoleManagementTableComponent],
  imports: [
    CommonModule,
    RoleManagementListRoutingModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatPaginatorModule,
    CoreCardViewModule,
    TranslocoModule,
    DialogsModule,
  ],
})
export class RoleManagementListModule {}
