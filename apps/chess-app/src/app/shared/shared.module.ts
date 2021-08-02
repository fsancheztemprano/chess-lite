import { NgModule } from '@angular/core';
import { FormErrorModule } from './components/form-error/form-error.component';
import { NgLetModule } from './directives/ng-let.directive';
import { IsMobileModule } from './pipes/is-mobile.pipe';

@NgModule({
  imports: [IsMobileModule, NgLetModule, FormErrorModule],
  exports: [IsMobileModule, NgLetModule, FormErrorModule],
})
export class SharedModule {}
