import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider, stubToasterServiceProvider } from '@app/ui/shared/app';
import { FormErrorModule } from '@app/ui/shared/common';
import { stubLocalizationRepositoryProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { stubUserManagementDetailServiceProvider } from '../../../../services/user-management-detail.service.stub';
import { UserManagementPreferencesComponent } from './user-management-preferences.component';

describe('UserManagementPreferencesComponent', () => {
  let component: UserManagementPreferencesComponent;
  let fixture: ComponentFixture<UserManagementPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatIconModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule,
        FormErrorModule,
        getTranslocoModule(),
      ],
      declarations: [UserManagementPreferencesComponent],
      providers: [
        stubUserManagementDetailServiceProvider,
        stubLocalizationRepositoryProvider,
        stubToasterServiceProvider,
        stubMessageServiceProvider,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
