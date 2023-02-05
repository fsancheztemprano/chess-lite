import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
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
    TranslocoModule,
  ],
})
export class GlobalSettingsGeneralModule {}
