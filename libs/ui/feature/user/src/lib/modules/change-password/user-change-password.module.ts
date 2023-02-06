import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
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
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class UserChangePasswordModule {}
