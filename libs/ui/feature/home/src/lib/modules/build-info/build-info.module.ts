import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { BuildInfoRoutingModule } from './build-info-routing.module';
import { BuildInfoComponent } from './components/build-info.component';

@NgModule({
  declarations: [BuildInfoComponent],
  imports: [CommonModule, BuildInfoRoutingModule, TranslocoModule],
})
export class BuildInfoModule {}
