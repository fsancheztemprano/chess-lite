import { ComponentFixture, TestBed } from '@angular/core/testing';
import { stubCoreServiceProvider } from '../../../../../../core/services/core.service.stub';
import { StubTiledMenuModule } from '../../../../../../shared/modules/tiled-menu/components/tiled-menu/tiled-menu.component.stub';
import { UserSettingsHomeComponent } from './user-settings-home.component';

describe('UserSettingsHomeComponent', () => {
  let component: UserSettingsHomeComponent;
  let fixture: ComponentFixture<UserSettingsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubTiledMenuModule],
      declarations: [UserSettingsHomeComponent],
      providers: [stubCoreServiceProvider],
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
