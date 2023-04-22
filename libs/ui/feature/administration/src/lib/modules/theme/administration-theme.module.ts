import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCardViewModule, ThemeColorPickerComponent } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
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
