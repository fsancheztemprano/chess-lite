import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Breakpoint } from '../breakpoint.model';
import { BreakpointService } from '../breakpoint.service';
import { StubBreakpointService, stubBreakpointServiceProvider } from '../breakpoint.service.stub';
import { BreakpointDirective } from './breakpoint.directive';

@Component({
  template: '<div *breakpoint="let breakpoint" class="test-component">{{breakpoint}}</div>',
})
class TestBreakpointComponent {}

const breakpoints = [Breakpoint.XS, Breakpoint.S, Breakpoint.M, Breakpoint.L, Breakpoint.XL];
describe('BreakpointDirective', () => {
  let fixture: ComponentFixture<TestBreakpointComponent>;
  let breakpointService: StubBreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BreakpointDirective],
      declarations: [TestBreakpointComponent],
      providers: [stubBreakpointServiceProvider],
    });
    fixture = TestBed.createComponent(TestBreakpointComponent);
    breakpointService = TestBed.inject(BreakpointService) as unknown as StubBreakpointService;
  });

  it.each(breakpoints)('should make breakpoint context available %p', (breakpoint) => {
    breakpointService._breakpoint$.next(breakpoint);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.test-component')).nativeElement.textContent).toBe(String(breakpoint));
  });
});
