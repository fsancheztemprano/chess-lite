import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidenavItemModule } from '@app/ui/shared';
import { AdministrationSidenavItemComponent } from './components/administration-sidenav-item.component';

@NgModule({
  declarations: [AdministrationSidenavItemComponent],
  imports: [CommonModule, SidenavItemModule],
  exports: [AdministrationSidenavItemComponent],
})
export class AdministrationSidenavItemModule {}
