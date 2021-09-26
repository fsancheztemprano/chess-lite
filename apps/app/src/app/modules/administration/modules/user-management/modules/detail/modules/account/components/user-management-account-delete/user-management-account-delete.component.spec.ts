import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgLetModule } from '../../../../../../../../../../shared/directives/ng-let.directive';
import { stubToasterServiceProvider } from '../../../../../../../../../../shared/services/toaster.service.stub';
import { stubUserManagementDetailServiceProvider } from '../../../../services/user-management-detail.service.stub';

import { UserManagementAccountDeleteComponent } from './user-management-account-delete.component';

describe('UserManagementAccountDeleteComponent', () => {
  let component: UserManagementAccountDeleteComponent;
  let fixture: ComponentFixture<UserManagementAccountDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule, MatCardModule, NgLetModule],
      declarations: [UserManagementAccountDeleteComponent],
      providers: [stubToasterServiceProvider, stubUserManagementDetailServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementAccountDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
