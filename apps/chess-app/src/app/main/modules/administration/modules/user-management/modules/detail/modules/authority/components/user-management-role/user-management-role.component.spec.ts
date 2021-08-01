import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormErrorModule } from '@app/shared';

import { UserManagementRoleComponent } from './user-management-role.component';

describe('UserManagementRoleComponent', () => {
  let component: UserManagementRoleComponent;
  let fixture: ComponentFixture<UserManagementRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatFormFieldModule,
        MatSelectModule,
        FormErrorModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [UserManagementRoleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
