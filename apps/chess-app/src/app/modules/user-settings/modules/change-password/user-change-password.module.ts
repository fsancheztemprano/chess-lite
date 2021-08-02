import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorModule } from '../../../../shared/components/form-error/form-error.component';
import { NgLetModule } from '../../../../shared/directives/ng-let.directive';
import { UserChangePasswordComponent } from './components/user-change-password/user-change-password.component';

import { UserChangePasswordRoutingModule } from './user-change-password-routing.module';

@NgModule({
  declarations: [UserChangePasswordComponent],
  imports: [
    CommonModule,
    UserChangePasswordRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    FormErrorModule,
    MatButtonModule,
    MatInputModule,
    NgLetModule,
  ],
})
export class UserChangePasswordModule {}
