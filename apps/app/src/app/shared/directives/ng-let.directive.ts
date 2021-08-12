/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, NgModule, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

export class NgLetContext {
  $implicit: any = null;
  ngLet: any = null;
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ngLet]' })
export class NgLetDirective implements OnInit {
  private _context = new NgLetContext();

  @Input()
  set ngLet(value: any) {
    this._context.$implicit = this._context.ngLet = value;
  }

  constructor(
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _templateRef: TemplateRef<NgLetContext>, // @formatter:off
  ) {} // @formatter:on

  ngOnInit() {
    this._viewContainerRef.createEmbeddedView(this._templateRef, this._context);
  }
}

@NgModule({
  declarations: [NgLetDirective],
  exports: [NgLetDirective],
})
export class NgLetModule {}
