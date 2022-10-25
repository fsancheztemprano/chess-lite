import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubTiledMenuModule } from '@app/ui/shared/common';
import { stubUserSettingsServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { UserSettingsHomeComponent } from './user-settings-home.component';

describe('UserSettingsHomeComponent', () => {
  let component: UserSettingsHomeComponent;
  let fixture: ComponentFixture<UserSettingsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubTiledMenuModule, getTranslocoModule()],
      declarations: [UserSettingsHomeComponent],
      providers: [stubUserSettingsServiceProvider],
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
