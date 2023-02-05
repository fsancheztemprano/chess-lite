import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
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
    CoreCardViewModule,
    TranslocoModule,
  ],
  providers: [MatDatepickerModule],
})
export class UserUpdateProfileModule {}
