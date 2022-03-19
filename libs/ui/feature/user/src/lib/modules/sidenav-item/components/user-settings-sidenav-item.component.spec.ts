import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubSidenavItemComponent } from '@app/ui/shared';
import { HalFormClientModule } from '@hal-form-client';
import { stubUserSettingsServiceProvider } from '../../../services/user-settings.service.stub';
import { UserSettingsSidenavItemComponent } from './user-settings-sidenav-item.component';

describe('UserSettingsSidenavItemComponent', () => {
  let component: UserSettingsSidenavItemComponent;
  let fixture: ComponentFixture<UserSettingsSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      declarations: [UserSettingsSidenavItemComponent, StubSidenavItemComponent],
      providers: [stubUserSettingsServiceProvider],
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
});
