import { NgModule } from '@angular/core';
import { IsMobileModule } from './pipes/is-mobile.pipe';
import { NgLetModule } from './directives/ng-let.directive';

@NgModule({
  declarations: [],
  imports: [IsMobileModule, NgLetModule],
  exports: [IsMobileModule, NgLetModule],
})
export class SharedModule {}
