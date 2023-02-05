import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormErrorModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
import { UserManagementAccountDeleteConfirmComponent } from './components/user-management-account-delete-confirm/user-management-account-delete-confirm.component';
import { UserManagementAccountDeleteComponent } from './components/user-management-account-delete/user-management-account-delete.component';
import { UserManagementAccountPasswordComponent } from './components/user-management-account-password/user-management-account-password.component';
import { UserManagementAccountTokenComponent } from './components/user-management-account-token/user-management-account-token.component';
import { UserManagementAccountComponent } from './components/user-management-account/user-management-account.component';
import { UserManagementAccountRoutingModule } from './user-management-account-routing.module';

@NgModule({
  declarations: [
    UserManagementAccountComponent,
    UserManagementAccountDeleteConfirmComponent,
    UserManagementAccountDeleteComponent,
    UserManagementAccountPasswordComponent,
    UserManagementAccountTokenComponent,
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
    NgLetModule,
    TranslocoModule,
  ],
})
export class UserManagementAccountModule {}
