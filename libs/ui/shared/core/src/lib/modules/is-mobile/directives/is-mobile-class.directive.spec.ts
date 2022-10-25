import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IsMobileService } from '../is-mobile.service';
import { StubIsMobileService, stubIsMobileServiceProvider } from '../is-mobile.service.stub';
import { IsMobileClassDirective } from './is-mobile-class.directive';

@Component({ template: '<div isMobileClass class="test-component"></div>' })
class TestIsMobileComponent {}

describe('IsMobileClassDirective', () => {
  let fixture: ComponentFixture<TestIsMobileComponent>;
  let isMobileService: StubIsMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestIsMobileComponent, IsMobileClassDirective],
      providers: [stubIsMobileServiceProvider],
    });
    fixture = TestBed.createComponent(TestIsMobileComponent);
    isMobileService = TestBed.inject(IsMobileService) as unknown as StubIsMobileService;
  });

  it('should add mobile class', () => {
    isMobileService['isHandset'].next(true);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.test-component.mobile'))).toBeTruthy();
  });

  it('should add mobile class', () => {
    isMobileService['isHandset'].next(false);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.test-component.mobile'))).toBeFalsy();
  });
});
