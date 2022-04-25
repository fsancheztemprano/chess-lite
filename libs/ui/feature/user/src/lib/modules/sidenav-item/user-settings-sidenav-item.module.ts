import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidenavItemModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { UserSettingsSidenavItemComponent } from './components/user-settings-sidenav-item.component';

@NgModule({
  declarations: [UserSettingsSidenavItemComponent],
  imports: [CommonModule, SidenavItemModule, TranslocoModule],
  exports: [UserSettingsSidenavItemComponent],
})
export class UserSettingsSidenavItemModule {}
