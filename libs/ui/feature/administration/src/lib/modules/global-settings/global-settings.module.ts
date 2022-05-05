import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';

import { GlobalSettingsRoutingModule } from './global-settings-routing.module';

@NgModule({
  declarations: [GlobalSettingsComponent],
  imports: [CommonModule, GlobalSettingsRoutingModule, CoreCardViewModule, TranslocoModule],
})
export class GlobalSettingsModule {}
