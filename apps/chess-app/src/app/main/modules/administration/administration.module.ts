import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationHomeComponent } from './components/administration-home/administration-home.component';

@NgModule({
  declarations: [AdministrationHomeComponent],
  imports: [CommonModule, AdministrationRoutingModule],
})
export class AdministrationModule {}
