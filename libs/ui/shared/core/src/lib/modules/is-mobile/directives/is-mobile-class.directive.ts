import { Directive, HostBinding } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IsMobileService } from '../is-mobile.service';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[isMobileClass]' })
export class IsMobileClassDirective {
  @HostBinding('class.mobile') private isMobile = false;

  constructor(private readonly isMobileService: IsMobileService) {
    this.isMobileService.isMobile$.pipe(untilDestroyed(this)).subscribe((isMobile) => (this.isMobile = isMobile));
  }
}
