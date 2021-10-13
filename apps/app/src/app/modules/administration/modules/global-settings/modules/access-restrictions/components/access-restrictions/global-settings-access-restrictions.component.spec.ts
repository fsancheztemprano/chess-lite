import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider } from '../../../../../../../../core/services/message.service.stub';
import { stubToasterServiceProvider } from '../../../../../../../../core/services/toaster.service.stub';
import { stubRoleManagementServiceProvider } from '../../../../../role-management/services/role-management.service.stub';

import { GlobalSettingsAccessRestrictionsComponent } from './global-settings-access-restrictions.component';

describe('GlobalSettingsAccessRestrictionsComponent', () => {
  let component: GlobalSettingsAccessRestrictionsComponent;
  let fixture: ComponentFixture<GlobalSettingsAccessRestrictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [GlobalSettingsAccessRestrictionsComponent],
      providers: [stubToasterServiceProvider, stubMessageServiceProvider, stubRoleManagementServiceProvider],
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
