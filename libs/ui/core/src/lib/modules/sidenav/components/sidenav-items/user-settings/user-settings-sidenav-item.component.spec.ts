import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
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
});
