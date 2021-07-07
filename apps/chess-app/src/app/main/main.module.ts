import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { DummyComponent } from './components/dummy/dummy.component';

@NgModule({
  declarations: [DummyComponent],
  imports: [CommonModule, MainRoutingModule],
})
export class MainModule {}
