import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidenavItemModule } from '@app/ui/shared/common';
import { HomeSidenavItemComponent } from './components/home-sidenav-item.component';

@NgModule({
  declarations: [HomeSidenavItemComponent],
  imports: [CommonModule, SidenavItemModule],
  exports: [HomeSidenavItemComponent],
})
export class HomeSidenavItemModule {}
