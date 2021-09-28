import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { stubToasterServiceProvider } from '../../../../../../../../../../core/services/toaster.service.stub';
import { StubFormErrorComponent } from '../../../../../../../../../../shared/modules/form-error/components/form-error.component.stub';
import { NgLetModule } from '../../../../../../../../../../shared/modules/ng-let/ng-let.module';
import { stubUserManagementDetailServiceProvider } from '../../../../services/user-management-detail.service.stub';
import { UserManagementProfileComponent } from './user-management-profile.component';

describe('UserManagementProfileComponent', () => {
  let component: UserManagementProfileComponent;
  let fixture: ComponentFixture<UserManagementProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatCardModule,
        ReactiveFormsModule,
        NgLetModule,
      ],
      declarations: [UserManagementProfileComponent, StubFormErrorComponent],
      providers: [MatDatepickerModule, stubToasterServiceProvider, stubUserManagementDetailServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
