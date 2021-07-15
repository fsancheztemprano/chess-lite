import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { of } from 'rxjs';
import { StubFormErrorComponent } from '../../../../../../../shared/components/form-error/form-error.component.stub';
import { stubUserServiceProvider } from '../../../../services/user.service.stub';

import { UserChangePasswordComponent } from './user-change-password.component';

const mockRouteData = { data: of({ user: new Resource({}) }) };

describe('UserChangePasswordComponent', () => {
  let component: UserChangePasswordComponent;
  let fixture: ComponentFixture<UserChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
      declarations: [UserChangePasswordComponent, StubFormErrorComponent],
      providers: [stubUserServiceProvider, { provide: ActivatedRoute, useValue: mockRouteData }],
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
