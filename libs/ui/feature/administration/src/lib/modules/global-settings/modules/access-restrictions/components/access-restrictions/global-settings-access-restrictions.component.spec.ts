import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider } from '@app/ui/shared/app';
import { getTranslocoModule } from '@app/ui/testing';
import { stubRoleManagementServiceProvider } from '../../../../../role-management/services/role-management.service.stub';

import { GlobalSettingsAccessRestrictionsComponent } from './global-settings-access-restrictions.component';

describe('GlobalSettingsAccessRestrictionsComponent', () => {
  let component: GlobalSettingsAccessRestrictionsComponent;
  let fixture: ComponentFixture<GlobalSettingsAccessRestrictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, getTranslocoModule()],
      declarations: [GlobalSettingsAccessRestrictionsComponent],
      providers: [stubMessageServiceProvider, stubRoleManagementServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSettingsAccessRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
