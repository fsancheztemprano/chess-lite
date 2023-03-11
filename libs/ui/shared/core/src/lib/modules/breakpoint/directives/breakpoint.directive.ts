import { Directive, EmbeddedViewRef, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../services/breakpoint.service';

interface BreakpointContext {
  breakpoint: Breakpoint;
  $implicit: Breakpoint;
}

@UntilDestroy()
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[breakpoint]',
  standalone: true,
})
export class BreakpointDirective implements OnInit {
  private readonly context: BreakpointContext = { breakpoint: Breakpoint.M, $implicit: Breakpoint.M };
  private embeddedViewRef?: EmbeddedViewRef<BreakpointContext>;

  constructor(
    private readonly templateRef: TemplateRef<BreakpointContext>,
    private readonly viewContainer: ViewContainerRef,
    private readonly breakpointService: BreakpointService,
  ) {}

  ngOnInit(): void {
    this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    this.breakpointService.breakpoint$.pipe(untilDestroyed(this)).subscribe((breakpoint) => {
      this.context.$implicit = this.context.breakpoint = breakpoint;
      this.embeddedViewRef?.markForCheck();
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static ngTemplateContextGuard(dir: BreakpointDirective, ctx: BreakpointContext): ctx is BreakpointContext {
    return true;
  }
}
