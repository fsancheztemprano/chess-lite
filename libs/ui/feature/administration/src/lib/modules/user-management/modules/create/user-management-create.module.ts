import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { UserManagementCreateComponent } from './components/user-management-create/user-management-create.component';
import { UserManagementCreateRoutingModule } from './user-management-create-routing.module';

@NgModule({
  declarations: [UserManagementCreateComponent],
  imports: [
    CommonModule,
    UserManagementCreateRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    FormErrorModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class UserManagementCreateModule {}
