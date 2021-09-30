import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { stubCardViewHeaderServiceProvider } from '../../../../../../core/modules/card-view/services/card-view-header.service.stub';
import { stubToasterServiceProvider } from '../../../../../../core/services/toaster.service.stub';
import { StubFormErrorComponent } from '../../../../../../shared/modules/form-error/components/form-error.component.stub';
import { NgLetModule } from '../../../../../../shared/modules/ng-let/ng-let.module';
import { stubUserSettingsServiceProvider } from '../../../../services/user-settings.service.stub';
import { UserUploadAvatarComponent } from './user-upload-avatar.component';

describe('UserUploadAvatarComponent', () => {
  let component: UserUploadAvatarComponent;
  let fixture: ComponentFixture<UserUploadAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, NgLetModule],
      declarations: [UserUploadAvatarComponent, StubFormErrorComponent],
      providers: [stubUserSettingsServiceProvider, stubCardViewHeaderServiceProvider, stubToasterServiceProvider],
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
