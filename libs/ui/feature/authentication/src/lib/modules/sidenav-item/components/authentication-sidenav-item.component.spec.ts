import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubSessionServiceProvider } from '@app/ui/shared/app';
import { StubSidenavItemComponent } from '@app/ui/shared/common';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
import { AuthenticationSidenavItemComponent } from './authentication-sidenav-item.component';

describe('AuthenticationSidenavItemComponent', () => {
  let component: AuthenticationSidenavItemComponent;
  let fixture: ComponentFixture<AuthenticationSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientModule, RouterTestingModule, getTranslocoModule()],
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
