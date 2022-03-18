import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubTiledMenuModule } from '@app/ui/shared';
import { stubCoreServiceProvider } from '../../../../../../core/services/core.service.stub';
import { stubUserSettingsServiceProvider } from '../../../../services/user-settings.service.stub';
import { UserSettingsHomeComponent } from './user-settings-home.component';

describe('UserSettingsHomeComponent', () => {
  let component: UserSettingsHomeComponent;
  let fixture: ComponentFixture<UserSettingsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubTiledMenuModule],
      declarations: [UserSettingsHomeComponent],
      providers: [stubCoreServiceProvider, stubUserSettingsServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
