import { NgModule } from '@angular/core';
import { IsMobilePipe } from './pipes/is-mobile.pipe';

@NgModule({
  declarations: [IsMobilePipe],
  exports: [IsMobilePipe],
})
export class IsMobileModule {}
