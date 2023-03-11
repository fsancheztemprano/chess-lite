import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../services/breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../services/breakpoint.service.stub';
import { IfOverSDirective } from './if-over-s.directive';

@Component({
  template: '<div *ifOverS class="display-over-s"></div>',
})
class TestIfOverSDirectiveComponent {}

describe('IfOverSDirective', () => {
  let fixture: ComponentFixture<TestIfOverSDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfOverSDirective],
      declarations: [TestIfOverSDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfOverSDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it.each([Breakpoint.S, Breakpoint.M, Breakpoint.L, Breakpoint.XL])(
    'should render element on or over s %p',
    (breakpoint) => {
      breakpointService._breakpoint$.next(breakpoint);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.display-over-s'))).toBeTruthy();
    },
  );

  it('should not render element when under s', () => {
    breakpointService._breakpoint$.next(Breakpoint.XS);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-over-s'))).toBeFalsy();
  });
});
