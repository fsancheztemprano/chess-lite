import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BreadcrumbService,
  IsMobileModule,
  IsMobileService,
  NgLetModule,
  stubBreadcrumbServiceProvider,
  StubIsMobileService,
  stubIsMobileServiceProvider,
  StubRouteUpButtonComponent,
} from '@app/ui/shared/core';
import { of } from 'rxjs';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let isMobileService: StubIsMobileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatIconModule, MatButtonModule, NgLetModule, IsMobileModule],
      declarations: [BreadcrumbComponent, StubRouteUpButtonComponent],
      providers: [stubBreadcrumbServiceProvider, stubIsMobileServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;

    const breadcrumbService = TestBed.inject(BreadcrumbService);
    breadcrumbService.breadcrumbs = [
      {
        url: '/home',
        icon: 'home',
      },
      {
        title$: of('Users'),
        url: '/users',
      },
      {
        title$: of('Roles'),
        url: '/roles',
      },
    ];

    fixture.detectChanges();
    isMobileService = TestBed.inject(IsMobileService) as unknown as StubIsMobileService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('route up button', () => {
    it('should render route up button on mobile', () => {
      isMobileService['isHandset'].next(true);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('app-route-up-button'))).toBeTruthy();
    });
    it('should not render route up button on desktop', () => {
      isMobileService['isHandset'].next(false);

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('app-route-up-button'))).toBeFalsy();
    });
  });

  it('should render breadcrumbs', () => {
    expect(fixture.debugElement.queryAll(By.css('a.breadcrumb-item'))).toHaveLength(3);
  });

  it('should render breadcrumb with title', () => {
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-0')).nativeElement.textContent).toContain('home');
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-1')).nativeElement.textContent).toContain('Users');
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-2')).nativeElement.textContent).toContain('Roles');
  });

  it('should only render current breadcrumb on mobile', () => {
    isMobileService['isHandset'].next(true);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-0'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-1'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-2'))).toBeTruthy();
  });

  it('should render navigate_next icon between breadcrumbs', () => {
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-0 + mat-icon')).nativeElement.textContent).toContain(
      'navigate_next',
    );
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-1 + mat-icon')).nativeElement.textContent).toContain(
      'navigate_next',
    );
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-2 + mat-icon'))).toBeFalsy();
  });

  it('should link breadcrumbs to route', () => {
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-0')).nativeElement.getAttribute('href')).toBe('/home');
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-1')).nativeElement.getAttribute('href')).toBe('/users');
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-2')).nativeElement.getAttribute('href')).toBe('/roles');
  });
});
