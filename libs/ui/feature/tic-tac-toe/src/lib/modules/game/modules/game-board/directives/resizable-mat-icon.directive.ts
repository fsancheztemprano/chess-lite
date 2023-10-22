import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[resizableMatIcon]',
  standalone: true,
})
export class ResizableMatIconDirective implements AfterViewInit, OnDestroy {
  private resizeObserver?: ResizeObserver;

  constructor(
    private readonly host: ElementRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    const parent = this.host.nativeElement.parentNode;

    if (parent) {
      this.resizeObserver = new ResizeObserver(() => this.scaleIcon());
      this.resizeObserver.observe(parent);
      this.scaleIcon();
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private scaleIcon() {
    const parent = this.host.nativeElement.parentNode;
    const icon = this.host.nativeElement;

    if (parent && icon) {
      const parentWidth = parent.offsetWidth;
      const scale = (parentWidth / 24) * 0.95;

      icon.style.transform = `scale(${scale})`;
      this.cdr.markForCheck();
    }
  }
}
