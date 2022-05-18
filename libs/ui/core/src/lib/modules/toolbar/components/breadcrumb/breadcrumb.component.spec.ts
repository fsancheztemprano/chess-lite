import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbService, StubBreadcrumbService, stubBreadcrumbServiceProvider } from '@app/ui/shared/core';
import { of } from 'rxjs';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatIconModule, MatButtonModule],
      declarations: [BreadcrumbComponent],
      providers: [stubBreadcrumbServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;

    const breadcrumbService = TestBed.inject(BreadcrumbService) as unknown as StubBreadcrumbService;
    breadcrumbService.breadcrumbs.next([
      {
        url: '/home',
        icon: 'home',
      },
      {
        title$: of('Users'),
        url: '/users',
      },
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render breadcrumbs', () => {
    expect(fixture.debugElement.queryAll(By.css('a.breadcrumb-item'))).toHaveLength(2);
  });

  it('should render breadcrumb with title', () => {
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-0')).nativeElement.textContent).toContain('home');
    expect(fixture.debugElement.query(By.css('a.breadcrumb-item-1')).nativeElement.textContent).toContain('Users');
  });
});
