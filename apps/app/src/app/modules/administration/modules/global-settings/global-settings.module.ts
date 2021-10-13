import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';

import { GlobalSettingsRoutingModule } from './global-settings-routing.module';

@NgModule({
  declarations: [GlobalSettingsComponent],
  imports: [CommonModule, GlobalSettingsRoutingModule],
})
export class GlobalSettingsModule {}
