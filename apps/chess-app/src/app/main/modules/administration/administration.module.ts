import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationHomeComponent } from './components/administration-home/administration-home.component';
import { AdministrationSidenavComponent } from './components/administration-sidenav/administration-sidenav.component';

@NgModule({
  declarations: [AdministrationHomeComponent, AdministrationSidenavComponent],
  imports: [CommonModule, AdministrationRoutingModule, MatListModule],
})
export class AdministrationModule {}
