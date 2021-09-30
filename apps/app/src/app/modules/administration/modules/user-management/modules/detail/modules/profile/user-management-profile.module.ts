import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorModule } from '../../../../../../../../shared/modules/form-error/form-error.module';
import { NgLetModule } from '../../../../../../../../shared/modules/ng-let/ng-let.module';
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
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    NgLetModule,
  ],
  providers: [MatDatepickerModule],
})
export class UserManagementProfileModule {}
