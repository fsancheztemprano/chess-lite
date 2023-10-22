import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[smartMatTooltip]',
  providers: [MatTooltip],
})
export class SmartMatTooltipDirective {
  @Input() smartMatTooltip!: string;
  @Input() smartMatTooltipTarget?: HTMLElement;
  @Input() matTooltipPosition: TooltipPosition = 'below';
  @Input() matTooltipShowDelay: NumberInput = 500;
  @Input() matTooltipHideDelay: NumberInput = 0;
  @Input() matTooltipClass: string | string[] | Set<string> | { [p: string]: never } = '';
  @Input() matTooltipDisabled: BooleanInput = false;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly tooltip: MatTooltip,
  ) {}

  @HostListener('mouseover') mouseover(): void {
    const element: HTMLElement = this.smartMatTooltipTarget || this.elementRef.nativeElement;
    if (element.offsetWidth < element.scrollWidth && this.smartMatTooltip) {
      this.tooltip.message = this.smartMatTooltip;
      this.tooltip.position = this.matTooltipPosition;
      this.tooltip.showDelay = this.matTooltipShowDelay;
      this.tooltip.hideDelay = this.matTooltipHideDelay;
      this.tooltip.disabled = this.matTooltipDisabled;
      this.tooltip.tooltipClass = this.matTooltipClass;
      this.tooltip.show();
    }
  }

  @HostListener('mouseleave') mouseleave(): void {
    this.tooltip.hide();
  }
}
