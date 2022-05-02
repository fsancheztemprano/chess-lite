import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormErrorModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { UserManagementPreferencesComponent } from './components/user-management-preferences/user-management-preferences.component';
import { UserManagementPreferencesRoutingModule } from './user-management-preferences-routing.module';

@NgModule({
  declarations: [UserManagementPreferencesComponent],
  imports: [
    CommonModule,
    UserManagementPreferencesRoutingModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormErrorModule,
    TranslocoModule,
  ],
})
export class UserManagementPreferencesModule {}
