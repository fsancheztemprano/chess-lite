import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { of } from 'rxjs';
import { StubFormErrorComponent } from '../../../../../../../shared/components/form-error/form-error.component.stub';
import { stubUserServiceProvider } from '../../../../services/user.service.stub';

import { UserUploadAvatarComponent } from './user-upload-avatar.component';

const mockRouteData = { data: of({ user: new Resource({}) }) };

describe('UserUploadAvatarComponent', () => {
  let component: UserUploadAvatarComponent;
  let fixture: ComponentFixture<UserUploadAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule],
      declarations: [UserUploadAvatarComponent, StubFormErrorComponent],
      providers: [stubUserServiceProvider, { provide: ActivatedRoute, useValue: mockRouteData }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUploadAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
