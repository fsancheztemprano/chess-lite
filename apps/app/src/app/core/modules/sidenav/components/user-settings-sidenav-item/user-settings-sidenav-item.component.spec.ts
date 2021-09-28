import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubUserSettingsServiceProvider } from '../../../../../modules/user-settings/services/user-settings.service.stub';
import { stubToasterServiceProvider } from '../../../../services/toaster.service.stub';
import { UserSettingsSidenavItemComponent } from './user-settings-sidenav-item.component';

describe('UserSettingsSidenavItemComponent', () => {
  let component: UserSettingsSidenavItemComponent;
  let fixture: ComponentFixture<UserSettingsSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatExpansionModule, MatIconModule, NoopAnimationsModule],
      declarations: [UserSettingsSidenavItemComponent],
      providers: [stubToasterServiceProvider, stubUserSettingsServiceProvider],
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
