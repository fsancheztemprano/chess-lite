import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { ThemeColorPickerComponent } from '../../../../../../shared/common/src/lib/modules/theme-color-picker/theme-color-picker.component';

import { AdministrationThemeRoutingModule } from './administration-theme-routing.module';
import { AdministrationThemeComponent } from './components/administration-theme.component';

@NgModule({
  declarations: [AdministrationThemeComponent],
  imports: [
    CommonModule,
    AdministrationThemeRoutingModule,
    ThemeColorPickerComponent,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class AdministrationThemeModule {}
