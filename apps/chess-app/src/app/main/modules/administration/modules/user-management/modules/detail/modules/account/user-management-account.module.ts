import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorModule } from '../../../../../../../../../shared/components/form-error/form-error.component';
import { UserManagementAccountDeleteConfirmComponent } from './components/user-management-account-delete-confirm/user-management-account-delete-confirm.component';
import { UserManagementAccountDeleteComponent } from './components/user-management-account-delete/user-management-account-delete.component';
import { UserManagementAccountPasswordComponent } from './components/user-management-account-password/user-management-account-password.component';
import { UserManagementAccountComponent } from './components/user-management-account/user-management-account.component';

import { UserManagementAccountRoutingModule } from './user-management-account-routing.module';

@NgModule({
  declarations: [
    UserManagementAccountComponent,
    UserManagementAccountDeleteConfirmComponent,
    UserManagementAccountDeleteComponent,
    UserManagementAccountPasswordComponent,
  ],
  imports: [
    CommonModule,
    UserManagementAccountRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    FormErrorModule,
  ],
})
export class UserManagementAccountModule {}
