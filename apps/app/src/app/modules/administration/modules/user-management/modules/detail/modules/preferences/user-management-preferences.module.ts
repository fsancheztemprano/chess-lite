import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { FormErrorModule } from '../../../../../../../../shared/modules/form-error/form-error.module';
import { UserManagementPreferencesComponent } from './components/user-management-preferences/user-management-preferences.component';
import { UserManagementPreferencesRoutingModule } from './user-management-preferences-routing.module';

@NgModule({
  declarations: [UserManagementPreferencesComponent],
  imports: [
    CommonModule,
    UserManagementPreferencesRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    FormErrorModule,
    TranslateModule,
    MatButtonModule,
  ],
})
export class UserManagementPreferencesModule {}
