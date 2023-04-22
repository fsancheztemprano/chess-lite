import { ChangeDetectorRef, Directive, HostBinding, inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IsMobileService } from '../is-mobile.service';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[isMobileClass]' })
export class IsMobileClassDirective {
  private readonly isMobileService: IsMobileService = inject(IsMobileService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  @HostBinding('class.mobile') private isMobile = false;

  constructor() {
    this.isMobileService.isMobile$.pipe(untilDestroyed(this)).subscribe((isMobile) => {
      this.isMobile = isMobile;
      this.cdr.markForCheck();
    });
  }
}
