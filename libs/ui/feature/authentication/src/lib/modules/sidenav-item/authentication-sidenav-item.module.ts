import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidenavItemModule } from '@app/ui/shared/common';
import { AuthenticationSidenavItemComponent } from './components/authentication-sidenav-item.component';

@NgModule({
  declarations: [AuthenticationSidenavItemComponent],
  imports: [CommonModule, SidenavItemModule],
  exports: [AuthenticationSidenavItemComponent],
})
export class AuthenticationSidenavItemModule {}
