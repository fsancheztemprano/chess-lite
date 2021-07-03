import { NgModule } from '@angular/core';
import { IsMobileModule } from './pipes/is-mobile.pipe';
import { NgLetModule } from './directives/ng-let.directive';
import { DummyComponent } from './components/dummy/dummy.component';

@NgModule({
  declarations: [DummyComponent],
  imports: [IsMobileModule, NgLetModule],
  exports: [DummyComponent],
})
export class SharedModule {}
