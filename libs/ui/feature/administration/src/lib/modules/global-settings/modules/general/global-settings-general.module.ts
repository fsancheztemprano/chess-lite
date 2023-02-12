import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { ThemeColorPickerComponent } from '../../../../../../../../shared/common/src/lib/modules/theme-color-picker/theme-color-picker.component';
import { GlobalSettingsColorPickerComponent } from './components/color-picker/global-settings-color-picker.component';
import { GlobalSettingsGeneralDefaultRoleComponent } from './components/default-role/global-settings-general-default-role.component';
import { GlobalSettingsGeneralComponent } from './components/general/global-settings-general.component';
import { GlobalSettingsGeneralSignupOpenComponent } from './components/signup-open/global-settings-general-signup-open.component';
import { GlobalSettingsGeneralRoutingModule } from './global-settings-general-routing.module';

@NgModule({
  declarations: [
    GlobalSettingsGeneralComponent,
    GlobalSettingsGeneralDefaultRoleComponent,
    GlobalSettingsGeneralSignupOpenComponent,
    GlobalSettingsColorPickerComponent,
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
    ThemeColorPickerComponent,
  ],
})
export class GlobalSettingsGeneralModule {}
