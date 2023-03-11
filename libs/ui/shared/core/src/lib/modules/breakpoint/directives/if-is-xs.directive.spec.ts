import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../services/breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../services/breakpoint.service.stub';
import { IfIsXsDirective } from './if-is-xs.directive';

@Component({
  template: '<div *ifIsXs class="display-on-xs"></div>',
})
class TestIfIsXsDirectiveComponent {}

describe('IfIsXSDirective', () => {
  let fixture: ComponentFixture<TestIfIsXsDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfIsXsDirective],
      declarations: [TestIfIsXsDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfIsXsDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it('should render element on xs', () => {
    breakpointService._breakpoint$.next(Breakpoint.XS);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-xs'))).toBeTruthy();
  });

  it.each([Breakpoint.S, Breakpoint.M, Breakpoint.L, Breakpoint.XL])(
    'should not render element on %p',
    (breakpoint) => {
      breakpointService._breakpoint$.next(breakpoint);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.display-on-xs'))).toBeFalsy();
    },
  );
});
