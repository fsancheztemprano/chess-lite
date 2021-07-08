import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DummyComponent } from './components/dummy/dummy.component';

import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [DummyComponent],
  imports: [CommonModule, MainRoutingModule],
})
export class MainModule {}
