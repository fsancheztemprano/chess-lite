import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../breakpoint.service.stub';
import { IfOverMDirective } from './if-over-m.directive';

@Component({
  template: '<div *ifOverM class="display-over-m"></div>',
})
class TestIfOverMDirectiveComponent {}

describe('IfOverMDirective', () => {
  let fixture: ComponentFixture<TestIfOverMDirectiveComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IfOverMDirective],
      declarations: [TestIfOverMDirectiveComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfOverMDirectiveComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it.each([Breakpoint.M, Breakpoint.L, Breakpoint.XL])('should render element on or over m %p', (breakpoint) => {
    breakpointService._breakpoint$.next(breakpoint);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-over-m'))).toBeTruthy();
  });

  it.each([Breakpoint.XS, Breakpoint.S])('should not render element when under m %p', (breakpoint) => {
    breakpointService._breakpoint$.next(breakpoint);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-over-m'))).toBeFalsy();
  });
});
