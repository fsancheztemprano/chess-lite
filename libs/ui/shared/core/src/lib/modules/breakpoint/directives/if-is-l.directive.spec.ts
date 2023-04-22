import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../services/breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../services/breakpoint.service.stub';
import { IfIsLDirective } from './if-is-l.directive';

@Component({
  template: '<div *ifIsL class="display-on-l"></div>',
})
class TestIfIsLDirectiveComponent {}

describe('IfIsLDirective', () => {
  let fixture: ComponentFixture<TestIfIsLDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfIsLDirective],
      declarations: [TestIfIsLDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfIsLDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it('should render element on m', () => {
    breakpointService._breakpoint$.next(Breakpoint.L);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-l'))).toBeTruthy();
  });

  it.each([Breakpoint.XS, Breakpoint.S, Breakpoint.M, Breakpoint.XL])(
    'should not render element on %p',
    (breakpoint) => {
      breakpointService._breakpoint$.next(breakpoint);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.display-on-l'))).toBeFalsy();
    },
  );
});
