import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TiledMenuModule } from '@app/ui/shared/core';
import { UserSettingsHomeComponent } from './components/user-settings-home/user-settings-home.component';
import { UserSettingsHomeRoutingModule } from './user-settings-home-routing.module';

@NgModule({
  declarations: [UserSettingsHomeComponent],
  imports: [CommonModule, UserSettingsHomeRoutingModule, TiledMenuModule],
})
export class UserSettingsHomeModule {}
