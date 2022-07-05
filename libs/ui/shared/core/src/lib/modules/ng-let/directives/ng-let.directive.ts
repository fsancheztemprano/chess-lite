/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/member-ordering */
import { Directive, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

interface NgLetContext<T> {
  ngLet: T;
  $implicit: T;
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ngLet]' })
export class NgLetDirective<T> implements OnInit {
  private context: NgLetContext<T | null> = { ngLet: null, $implicit: null };
  private embeddedViewRef?: EmbeddedViewRef<NgLetContext<T | null>>;

  // @formatter:off
  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly templateRef: TemplateRef<NgLetContext<T>>,
  ) {}
  // @formatter:on

  @Input()
  set ngLet(value: T) {
    this.context.$implicit = this.context.ngLet = value;
    this.embeddedViewRef?.markForCheck();
  }

  ngOnInit(): void {
    this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  /** @internal */
  public static ngLetUseIfTypeGuard: void;

  /**
   * Assert the correct type of the expression bound to the `NgLet` input within the template.
   *
   * The presence of this static field is a signal to the Ivy template type check compiler that
   * when the `NgLet` structural directive renders its template, the type of the expression bound
   * to `NgLet` should be narrowed in some way. For `NgLet`, the binding expression itself is used to
   * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `NgLet`.
   */
  static ngTemplateGuard_ngLet: 'binding';

  /**
   * Asserts the correct type of the context for the template that `NgLet` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgLet` structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard<T>(
    dir: NgLetDirective<T>,
    ctx: any,
  ): ctx is NgLetContext<Exclude<T, false | 0 | '' | null | undefined>> {
    return true;
  }
}
