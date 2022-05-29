import { NgModule } from '@angular/core';
import { IsMobilePipe } from './is-mobile.pipe';
import { IsMobileService } from './is-mobile.service';

@NgModule({
  declarations: [IsMobilePipe],
  exports: [IsMobilePipe],
  providers: [IsMobileService],
})
export class IsMobileModule {}
