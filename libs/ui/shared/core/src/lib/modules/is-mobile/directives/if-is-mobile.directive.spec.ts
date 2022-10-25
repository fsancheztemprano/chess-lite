import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IsMobileService } from '../is-mobile.service';
import { StubIsMobileService, stubIsMobileServiceProvider } from '../is-mobile.service.stub';
import { IfIsMobileDirective } from './if-is-mobile.directive';

@Component({
  template: '<div *ifIsMobile class="display-on-mobile"></div>',
})
class TestIfIsMobileComponent {}

describe('IfIsMobileDirective', () => {
  let fixture: ComponentFixture<TestIfIsMobileComponent>;
  let isMobileService: StubIsMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestIfIsMobileComponent, IfIsMobileDirective],
      providers: [stubIsMobileServiceProvider],
    });
    fixture = TestBed.createComponent(TestIfIsMobileComponent);
    isMobileService = TestBed.inject(IsMobileService) as unknown as StubIsMobileService;
  });

  it('should render element on mobile', () => {
    isMobileService['isHandset'].next(true);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-mobile'))).toBeTruthy();
  });

  it('should not render element on mobile', () => {
    isMobileService['isHandset'].next(false);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.display-on-mobile'))).toBeFalsy();
  });
});
