import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
