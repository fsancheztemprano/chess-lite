import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { UserSettingsSidenavItemComponent } from './components/user-settings-sidenav-item.component';

@NgModule({
  declarations: [UserSettingsSidenavItemComponent],
  imports: [CommonModule, MatExpansionModule, MatListModule, MatIconModule, RouterModule],
  exports: [UserSettingsSidenavItemComponent],
})
export class UserSettingsSidenavItemModule {}
