import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GlobalSettingsGeneralDefaultRoleComponent } from './components/default-role/global-settings-general-default-role.component';
import { GlobalSettingsGeneralComponent } from './components/general/global-settings-general.component';
import { GlobalSettingsGeneralSignupOpenComponent } from './components/signup-open/global-settings-general-signup-open.component';

import { GlobalSettingsGeneralRoutingModule } from './global-settings-general-routing.module';

@NgModule({
  declarations: [
    GlobalSettingsGeneralComponent,
    GlobalSettingsGeneralDefaultRoleComponent,
    GlobalSettingsGeneralSignupOpenComponent,
  ],
  imports: [
    CommonModule,
    GlobalSettingsGeneralRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
})
export class GlobalSettingsGeneralModule {}
