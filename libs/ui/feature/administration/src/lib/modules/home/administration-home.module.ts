import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TiledMenuModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { AdministrationHomeRoutingModule } from './administration-home-routing.module';
import { AdministrationHomeComponent } from './components/home/administration-home.component';

@NgModule({
  declarations: [AdministrationHomeComponent],
  imports: [CommonModule, AdministrationHomeRoutingModule, TiledMenuModule, TranslocoModule],
})
export class AdministrationHomeModule {}
