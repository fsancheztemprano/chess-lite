import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../breakpoint.service.stub';
import { IfIsSDirective } from './if-is-s.directive';

@Component({
  template: '<div *ifIsS class="display-on-s"></div>',
})
class TestIfIsSDirectiveComponent {}

describe('IfIsSDirective', () => {
  let fixture: ComponentFixture<TestIfIsSDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfIsSDirective],
      declarations: [TestIfIsSDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfIsSDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it('should render element on s', () => {
    breakpointService._breakpoint$.next(Breakpoint.S);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-s'))).toBeTruthy();
  });

  it.each([Breakpoint.XS, Breakpoint.M, Breakpoint.L, Breakpoint.XL])(
    'should not render element on %p',
    (breakpoint) => {
      breakpointService._breakpoint$.next(breakpoint);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.display-on-s'))).toBeFalsy();
    },
  );
});
