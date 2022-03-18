import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormErrorModule, NgLetModule } from '@app/ui/shared';
import { stubToasterServiceProvider } from '../../../../../../../../../../core/services/toaster.service.stub';
import { stubUserManagementDetailServiceProvider } from '../../../../services/user-management-detail.service.stub';
import { UserManagementAccountPasswordComponent } from './user-management-account-password.component';

describe('UserManagementAccountPasswordComponent', () => {
  let component: UserManagementAccountPasswordComponent;
  let fixture: ComponentFixture<UserManagementAccountPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        FormErrorModule,
        ReactiveFormsModule,
        NgLetModule,
      ],
      declarations: [UserManagementAccountPasswordComponent],
      providers: [stubToasterServiceProvider, stubUserManagementDetailServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementAccountPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
