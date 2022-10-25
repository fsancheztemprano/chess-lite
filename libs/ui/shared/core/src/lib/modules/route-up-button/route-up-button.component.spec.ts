import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { stubBreadcrumbServiceProvider } from '../../services/toolbar/breadcrumb.service.stub';
import { RouteUpButtonComponent } from './route-up-button.component';

describe('RouteUpButtonComponent', () => {
  let component: RouteUpButtonComponent;
  let fixture: ComponentFixture<RouteUpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, RouterTestingModule],
      declarations: [RouteUpButtonComponent],
      providers: [stubBreadcrumbServiceProvider],
    })
      .overrideComponent(RouteUpButtonComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render link button', () => {
    expect(fixture.debugElement.query(By.css('a[href="/parent-route"]'))).toBeTruthy();
  });

  it('should render icon', () => {
    expect(fixture.debugElement.query(By.css('mat-icon')).nativeElement.textContent).toEqual('keyboard_return');
    component.icon = 'home';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-icon')).nativeElement.textContent).toEqual('home');
  });

  it('should link to input', () => {
    component.navigationLink = '/home';
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('a[href="/home"]'))).toBeTruthy();
  });
});
