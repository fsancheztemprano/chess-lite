import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../services/breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../services/breakpoint.service.stub';
import { IfIsXlDirective } from './if-is-xl.directive';

@Component({
  template: '<div *ifIsXl class="display-on-xl"></div>',
})
class TestIfIsXlDirectiveComponent {}

describe('IfIsXlDirective', () => {
  let fixture: ComponentFixture<TestIfIsXlDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfIsXlDirective],
      declarations: [TestIfIsXlDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfIsXlDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it('should render element on xl', () => {
    breakpointService._breakpoint$.next(Breakpoint.XL);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-xl'))).toBeTruthy();
  });

  it.each([Breakpoint.XS, Breakpoint.S, Breakpoint.M, Breakpoint.L])(
    'should not render element on %p',
    (breakpoint) => {
      breakpointService._breakpoint$.next(breakpoint);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('div.display-on-xl'))).toBeFalsy();
    },
  );
});
