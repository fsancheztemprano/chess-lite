import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubToasterServiceProvider } from '../../../../../../../../core/services/toaster.service.stub';
import { stubGlobalSettingsServiceProvider } from '../../../../services/global-settings.service.stub';

import { GlobalSettingsGeneralDefaultRoleComponent } from './global-settings-general-default-role.component';

describe('GlobalSettingsGeneralDefaultRoleComponent', () => {
  let component: GlobalSettingsGeneralDefaultRoleComponent;
  let fixture: ComponentFixture<GlobalSettingsGeneralDefaultRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
      ],
      declarations: [GlobalSettingsGeneralDefaultRoleComponent],
      providers: [stubGlobalSettingsServiceProvider, stubToasterServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSettingsGeneralDefaultRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
