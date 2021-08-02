import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

import { UserSettingsRoutingModule } from './user-settings-routing.module';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [CommonModule, UserSettingsRoutingModule, MatListModule],
})
export class UserSettingsModule {}
