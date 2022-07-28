import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubSessionServiceProvider } from '@app/ui/shared/app';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { StubSidenavItemComponent } from '../../sidenav-item/sidenav-item.component.stub';
import { AuthenticationSidenavItemComponent } from './authentication-sidenav-item.component';

describe('AuthenticationSidenavItemComponent', () => {
  let component: AuthenticationSidenavItemComponent;
  let fixture: ComponentFixture<AuthenticationSidenavItemComponent>;
  let customActionsStream: Actions;

  beforeEach(async () => {
    customActionsStream = new Actions();
    await TestBed.configureTestingModule({
      imports: [
        HalFormClientModule,
        RouterTestingModule,
        getTranslocoModule(),
        EffectsNgModule.forRoot([], { customActionsStream }),
      ],
      declarations: [AuthenticationSidenavItemComponent, StubSidenavItemComponent],
      providers: [stubSessionServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.spyOn(component['router'], 'navigate').mockImplementation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have link to logout', () => {
    expect(component.items).toPartiallyContain({ icon: 'logout' });
  });
  it('should have link to login', () => {
    expect(component.items).toPartiallyContain({ route: ['/auth', 'login'] });
  });
  it('should have link to signup', () => {
    expect(component.items).toPartiallyContain({ route: ['/auth', 'signup'] });
  });

  it('logout should clear session and navigate to login ', (done) => {
    customActionsStream.subscribe((action) => {
      expect(action).toBeTruthy();
      expect(action.type).toBe('[Session] Clear Session');
      done();
    });

    expect(component['router'].navigate).not.toHaveBeenCalled();

    component.logout();

    expect(component['router'].navigate).toHaveBeenCalledTimes(1);
  });
});
