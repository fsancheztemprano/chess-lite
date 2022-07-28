import { NgModule } from '@angular/core';
import { IfIsDesktopDirective } from './directives/if-is-desktop.directive';
import { IfIsMobileDirective } from './directives/if-is-mobile.directive';
import { IsMobileDirective } from './directives/is-mobile.directive';
import { IsMobilePipe } from './is-mobile.pipe';
import { IsMobileService } from './is-mobile.service';

@NgModule({
  declarations: [IsMobilePipe, IsMobileDirective, IfIsMobileDirective, IfIsDesktopDirective],
  exports: [IsMobilePipe, IsMobileDirective, IfIsMobileDirective, IfIsDesktopDirective],
  providers: [IsMobileService],
})
export class IsMobileModule {}
