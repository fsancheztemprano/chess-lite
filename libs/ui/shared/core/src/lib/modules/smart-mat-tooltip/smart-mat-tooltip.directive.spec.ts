import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { SmartMatTooltipDirective } from './smart-mat-tooltip.directive';
import { SmartMatTooltipModule } from './smart-mat-tooltip.module';

@Component({
  selector: 'app-stub',
  template: `<span [smartMatTooltip]="label">{{ label }}</span>`,
})
class StubComponent {
  public label = 'test';
}

describe('SmartMatTooltipDirective', () => {
  let component: StubComponent;
  let fixture: ComponentFixture<StubComponent>;
  let directive: SmartMatTooltipDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartMatTooltipModule, MatTooltipModule],
      declarations: [StubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StubComponent);
    component = fixture.componentInstance;
    directive = fixture.debugElement
      .query(By.directive(SmartMatTooltipDirective))
      .injector.get(SmartMatTooltipDirective);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  describe('when the host element is the target to check if the content overflows', () => {
    it('should show tooltip when element offset width is less than scroll width', () => {
      const matTooltipSpy = jest.spyOn(directive['tooltip'], 'show');
      const spanElement = fixture.debugElement.query(By.css('span'));

      Object.defineProperty(HTMLSpanElement.prototype, 'scrollWidth', { configurable: true, value: 11 });
      Object.defineProperty(HTMLSpanElement.prototype, 'offsetWidth', { configurable: true, value: 10 });
      fixture.detectChanges();

      spanElement.nativeElement.dispatchEvent(new Event('mouseover'));

      expect(matTooltipSpy).toHaveBeenCalledTimes(1);
    });

    it('should not show tooltip when element offset width is equal than scroll width', () => {
      const matTooltipSpy = jest.spyOn(directive['tooltip'], 'show');
      const spanElement = fixture.debugElement.query(By.css('span'));

      Object.defineProperty(HTMLSpanElement.prototype, 'scrollWidth', { configurable: true, value: 10 });
      Object.defineProperty(HTMLSpanElement.prototype, 'offsetWidth', { configurable: true, value: 10 });
      fixture.detectChanges();

      spanElement.nativeElement.dispatchEvent(new Event('mouseover'));

      expect(matTooltipSpy).not.toHaveBeenCalled();
    });

    it('should not show tooltip when element offset width is greater than scroll width', () => {
      const matTooltipSpy = jest.spyOn(directive['tooltip'], 'show');
      const spanElement = fixture.debugElement.query(By.css('span'));

      Object.defineProperty(HTMLSpanElement.prototype, 'scrollWidth', { configurable: true, value: 10 });
      Object.defineProperty(HTMLSpanElement.prototype, 'offsetWidth', { configurable: true, value: 11 });
      fixture.detectChanges();

      spanElement.nativeElement.dispatchEvent(new Event('mouseover'));

      expect(matTooltipSpy).not.toHaveBeenCalled();
    });
  });

  describe('when the host element is overridden to check if the content overflows ', () => {
    it('should show tooltip when overridden element offset width is less than scroll width', () => {
      const matTooltipSpy = jest.spyOn(directive['tooltip'], 'show');
      const spanElement = fixture.debugElement.query(By.css('span'));

      directive.smartMatTooltipTarget = { scrollWidth: 11, offsetWidth: 10 } as HTMLElement;
      fixture.detectChanges();

      spanElement.nativeElement.dispatchEvent(new Event('mouseover'));

      expect(matTooltipSpy).toHaveBeenCalledTimes(1);
    });

    it('should not show tooltip when overridden element offset width is equal than scroll width', () => {
      const matTooltipSpy = jest.spyOn(directive['tooltip'], 'show');
      const spanElement = fixture.debugElement.query(By.css('span'));

      directive.smartMatTooltipTarget = { scrollWidth: 10, offsetWidth: 10 } as HTMLElement;
      fixture.detectChanges();

      spanElement.nativeElement.dispatchEvent(new Event('mouseover'));

      expect(matTooltipSpy).not.toHaveBeenCalled();
    });

    it('should not show tooltip when overridden element offset width is greater than scroll width', () => {
      const matTooltipSpy = jest.spyOn(directive['tooltip'], 'show');
      const spanElement = fixture.debugElement.query(By.css('span'));

      directive.smartMatTooltipTarget = { scrollWidth: 10, offsetWidth: 11 } as HTMLElement;
      fixture.detectChanges();

      spanElement.nativeElement.dispatchEvent(new Event('mouseover'));

      expect(matTooltipSpy).not.toHaveBeenCalled();
    });
  });

  it('should set tooltip properties', () => {
    const spanElement = fixture.debugElement.query(By.css('span'));
    directive.smartMatTooltipTarget = { scrollWidth: 11, offsetWidth: 10 } as HTMLElement;
    directive.matTooltipClass = 'test-class';
    directive.matTooltipDisabled = false;
    directive.matTooltipPosition = 'above';
    directive.matTooltipShowDelay = 1000;
    directive.matTooltipHideDelay = 2000;
    fixture.detectChanges();
    spanElement.nativeElement.dispatchEvent(new Event('mouseover'));

    expect(directive['tooltip'].message).toBe(component.label);
    expect(directive['tooltip'].position).toBe('above');
    expect(directive['tooltip'].disabled).toBe(false);
    expect(directive['tooltip'].showDelay).toBe(1000);
    expect(directive['tooltip'].hideDelay).toBe(2000);
    expect(directive['tooltip'].tooltipClass).toBe('test-class');
  });

  it('should hide smart tooltip on mouseleave', () => {
    const matTooltipSpy = jest.spyOn(directive['tooltip'], 'hide');
    const spanElement = fixture.debugElement.query(By.css('span'));

    spanElement.nativeElement.dispatchEvent(new Event('mouseleave'));

    expect(matTooltipSpy).toHaveBeenCalledTimes(1);
  });
});
