import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StubFormErrorComponent } from '../../../../../../shared/components/form-error/form-error.component.stub';
import { NgLetModule } from '../../../../../../shared/directives/ng-let.directive';
import { stubCurrentUserServiceProvider } from '../../../../services/current-user.service.stub';

import { UserChangePasswordComponent } from './user-change-password.component';

describe('UserChangePasswordComponent', () => {
  let component: UserChangePasswordComponent;
  let fixture: ComponentFixture<UserChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NgLetModule,
      ],
      declarations: [UserChangePasswordComponent, StubFormErrorComponent],
      providers: [stubCurrentUserServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
