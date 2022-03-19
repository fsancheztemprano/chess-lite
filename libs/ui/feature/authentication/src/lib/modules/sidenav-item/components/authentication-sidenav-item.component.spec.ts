import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubSessionServiceProvider, StubSidenavItemComponent } from '@app/ui/shared';
import { HalFormClientModule } from '@hal-form-client';
import { AuthenticationSidenavItemComponent } from './authentication-sidenav-item.component';

describe('AuthenticationSidenavItemComponent', () => {
  let component: AuthenticationSidenavItemComponent;
  let fixture: ComponentFixture<AuthenticationSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientModule, RouterTestingModule],
      declarations: [AuthenticationSidenavItemComponent, StubSidenavItemComponent],
      providers: [stubSessionServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
