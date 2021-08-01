import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormErrorModule } from '../../../../../../../../../../../shared/components/form-error/form-error.component';

import { UserManagementAccountPasswordComponent } from './user-management-account-password.component';

describe('UserManagementAccountPasswordComponent', () => {
  let component: UserManagementAccountPasswordComponent;
  let fixture: ComponentFixture<UserManagementAccountPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        FormErrorModule,
        ReactiveFormsModule,
      ],
      declarations: [UserManagementAccountPasswordComponent],
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
