import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorModule } from '../../../../../../../../../shared/components/form-error/form-error.component';
import { UserManagementProfileComponent } from './components/user-management-profile/user-management-profile.component';

import { UserManagementProfileRoutingModule } from './user-management-profile-routing.module';

@NgModule({
  declarations: [UserManagementProfileComponent],
  imports: [
    CommonModule,
    UserManagementProfileRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormErrorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class UserManagementProfileModule {}
