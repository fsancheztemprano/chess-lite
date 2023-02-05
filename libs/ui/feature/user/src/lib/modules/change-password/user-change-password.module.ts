import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
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
