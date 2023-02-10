import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TiledMenuModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { HomeComponent } from './components/home.component';

import { HomeTileRoutingModule } from './home-tile-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeTileRoutingModule, TiledMenuModule, TranslocoModule],
})
export class HomeTileModule {}
