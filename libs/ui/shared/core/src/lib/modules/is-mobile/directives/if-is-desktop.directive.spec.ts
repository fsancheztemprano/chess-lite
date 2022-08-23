import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IsMobileService } from '../is-mobile.service';
import { StubIsMobileService, stubIsMobileServiceProvider } from '../is-mobile.service.stub';
import { IfIsDesktopDirective } from './if-is-desktop.directive';

@Component({
  template: '<div *ifIsDesktop class="display-on-desktop"></div>',
})
class TestIfIsMobileComponent {}

describe('IfIsDesktopDirective', () => {
  let fixture: ComponentFixture<TestIfIsMobileComponent>;
  let isMobileService: StubIsMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestIfIsMobileComponent, IfIsDesktopDirective],
      providers: [stubIsMobileServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfIsMobileComponent);
    isMobileService = TestBed.inject(IsMobileService) as unknown as StubIsMobileService;
  });

  it('should render element on desktop', () => {
    isMobileService['isHandset'].next(false);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-desktop'))).toBeTruthy();
  });

  it('should not render element on mobile', () => {
    isMobileService['isHandset'].next(true);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-desktop'))).toBeFalsy();
  });
});
