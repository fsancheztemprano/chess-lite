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
import { FormErrorModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { UserUpdateProfileComponent } from './components/user-update-profile/user-update-profile.component';
import { UserUpdateProfileRoutingModule } from './user-update-profile-routing.module';

@NgModule({
  declarations: [UserUpdateProfileComponent],
  imports: [
    CommonModule,
    UserUpdateProfileRoutingModule,
    FormErrorModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgLetModule,
  ],
  providers: [MatDatepickerModule],
})
export class UserUpdateProfileModule {}
