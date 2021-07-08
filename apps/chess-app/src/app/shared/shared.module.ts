import { NgModule } from '@angular/core';
import { NgLetModule } from './directives/ng-let.directive';
import { IsMobileModule } from './pipes/is-mobile.pipe';

@NgModule({
  declarations: [],
  imports: [IsMobileModule, NgLetModule],
  exports: [IsMobileModule, NgLetModule],
})
export class SharedModule {}
