import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormErrorModule } from '../../../../../../shared/components/form-error/form-error.component';
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
  ],
})
export class UserManagementCreateModule {}
