import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TiledMenuModule } from '@app/ui/shared/common';
import { AdministrationHomeRoutingModule } from './administration-home-routing.module';
import { AdministrationHomeComponent } from './components/home/administration-home.component';

@NgModule({
  declarations: [AdministrationHomeComponent],
  imports: [CommonModule, AdministrationHomeRoutingModule, TiledMenuModule],
})
export class AdministrationHomeModule {}
