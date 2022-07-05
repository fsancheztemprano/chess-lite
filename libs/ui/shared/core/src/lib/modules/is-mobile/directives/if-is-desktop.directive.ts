import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
import { IsMobileService } from '../is-mobile.service';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ifIsDesktop]' })
export class IfIsDesktopDirective implements OnInit {
  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly isMobileService: IsMobileService,
  ) {}

  ngOnInit(): void {
    this.isMobileService.isMobile$
      .pipe(
        untilDestroyed(this),
        map((isMobile) => !isMobile),
      )
      .subscribe((isDesktop) => {
        if (isDesktop && !this.viewContainer.length) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
