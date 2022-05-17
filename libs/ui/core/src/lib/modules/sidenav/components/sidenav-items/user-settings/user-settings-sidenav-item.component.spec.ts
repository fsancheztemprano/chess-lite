import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrentUserRelations } from '@app/ui/shared/domain';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { StubSidenavItemComponent } from '../../sidenav-item/sidenav-item.component.stub';
import { UserSettingsSidenavItemComponent } from './user-settings-sidenav-item.component';

describe('UserSettingsSidenavItemComponent', () => {
  let component: UserSettingsSidenavItemComponent;
  let fixture: ComponentFixture<UserSettingsSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientModule, getTranslocoModule()],
      declarations: [UserSettingsSidenavItemComponent, StubSidenavItemComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have link to user settings', () => {
    expect(component.items).toPartiallyContain({ route: '/user' });
  });

  it('should have link to user profile', () => {
    expect(component.items).toPartiallyContain({ route: ['/user', 'profile'] });
  });

  it('should have link to user avatar', () => {
    expect(component.items).toPartiallyContain({ route: ['/user', 'avatar'] });
  });

  it('should have link to user password', () => {
    expect(component.items).toPartiallyContain({ route: ['/user', 'password'] });
  });

  it('should have link to user delete', () => {
    expect(component.items).toPartiallyContain({ route: ['/user', 'delete'] });
  });

  it('should have link to user preferences', () => {
    expect(component.items).toPartiallyContain({ route: ['/user', 'preferences'] });
  });

  it('should not render if current user link is not available', () => {
    expect(fixture.debugElement.query(By.css('app-sidenav-item'))).toBeFalsy();
  });

  it('should render if current user link is available', () => {
    TestBed.inject(HalFormService).setResource({
      _links: {
        self: { href: '/api' },
        [CurrentUserRelations.CURRENT_USER_REL]: { href: '/user/1' },
      },
    });

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-sidenav-item'))).toBeTruthy();
  });
});
