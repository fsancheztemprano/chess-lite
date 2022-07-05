import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IsMobileService } from '../is-mobile.service';
import { StubIsMobileService, stubIsMobileServiceProvider } from '../is-mobile.service.stub';
import { IsMobileDirective } from './is-mobile.directive';

@Component({
  template: '<div *isMobile="let isMobile" class="test-component">{{isMobile}}</div>',
})
class TestIsMobileComponent {
  value = 'test';
}

describe('IsMobileDirective', () => {
  let fixture: ComponentFixture<TestIsMobileComponent>;
  let isMobileService: StubIsMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestIsMobileComponent, IsMobileDirective],
      providers: [stubIsMobileServiceProvider],
    });
    fixture = TestBed.createComponent(TestIsMobileComponent);
    isMobileService = TestBed.inject(IsMobileService) as unknown as StubIsMobileService;
  });

  it('should make is mobile context available', () => {
    isMobileService['isHandset'].next(true);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.test-component')).nativeElement.textContent).toBe('true');
  });

  it('should make is desktop context available', () => {
    isMobileService['isHandset'].next(false);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div.test-component')).nativeElement.textContent).toBe('false');
  });
});
