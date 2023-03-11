import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../services/breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../services/breakpoint.service.stub';
import { IfIsMDirective } from './if-is-m.directive';

@Component({
  template: '<div *ifIsM class="display-on-m"></div>',
})
class TestIfIsMDirectiveComponent {}

describe('IfIsMDirective', () => {
  let fixture: ComponentFixture<TestIfIsMDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfIsMDirective],
      declarations: [TestIfIsMDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfIsMDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it('should render element on m', () => {
    breakpointService._breakpoint$.next(Breakpoint.M);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-m'))).toBeTruthy();
  });

  it.each([Breakpoint.XS, Breakpoint.S, Breakpoint.L, Breakpoint.XL])(
    'should not render element on %p',
    (breakpoint) => {
      breakpointService._breakpoint$.next(breakpoint);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.display-on-m'))).toBeFalsy();
    },
  );
});
