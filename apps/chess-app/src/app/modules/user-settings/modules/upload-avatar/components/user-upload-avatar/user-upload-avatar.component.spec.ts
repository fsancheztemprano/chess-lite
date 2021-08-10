import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { stubHeaderServiceProvider } from '../../../../../../core/services/header.service.stub';
import { StubFormErrorComponent } from '../../../../../../shared/components/form-error/form-error.component.stub';
import { NgLetModule } from '../../../../../../shared/directives/ng-let.directive';
import { stubToasterServiceProvider } from '../../../../../../shared/services/toaster.service.stub';
import { stubCurrentUserServiceProvider } from '../../../../services/current-user.service.stub';

import { UserUploadAvatarComponent } from './user-upload-avatar.component';

describe('UserUploadAvatarComponent', () => {
  let component: UserUploadAvatarComponent;
  let fixture: ComponentFixture<UserUploadAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, NgLetModule],
      declarations: [UserUploadAvatarComponent, StubFormErrorComponent],
      providers: [stubCurrentUserServiceProvider, stubHeaderServiceProvider, stubToasterServiceProvider],
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
