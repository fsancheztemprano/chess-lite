import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../breakpoint.service.stub';
import { IfOverLDirective } from './if-over-l.directive';

@Component({
  template: '<div *ifOverL class="display-over-l"></div>',
})
class TestIfOverLDirectiveComponent {}

describe('IfOverLDirective', () => {
  let fixture: ComponentFixture<TestIfOverLDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfOverLDirective],
      declarations: [TestIfOverLDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfOverLDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it.each([Breakpoint.L, Breakpoint.XL])('should render element on or over l %p', (breakpoint) => {
    breakpointService._breakpoint$.next(breakpoint);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-over-l'))).toBeTruthy();
  });

  it.each([Breakpoint.XS, Breakpoint.S, Breakpoint.M])('should not render element when under l %p', (breakpoint) => {
    breakpointService._breakpoint$.next(breakpoint);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-over-l'))).toBeFalsy();
  });
});
