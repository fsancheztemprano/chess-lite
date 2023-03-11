import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointService } from '../services/breakpoint.service';

@UntilDestroy()
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ifOverS]',
  standalone: true,
})
export class IfOverSDirective implements OnInit {
  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly breakpointService: BreakpointService,
  ) {}

  ngOnInit(): void {
    this.breakpointService.overS$.pipe(untilDestroyed(this)).subscribe((overS) => {
      if (overS && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
