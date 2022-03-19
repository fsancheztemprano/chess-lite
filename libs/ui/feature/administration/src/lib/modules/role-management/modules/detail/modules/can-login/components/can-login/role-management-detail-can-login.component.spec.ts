import { ComponentFixture, TestBed } from '@angular/core/testing';
import { stubRoleManagementServiceProvider } from '../../../../../../services/role-management.service.stub';

import { RoleManagementDetailCanLoginComponent } from './role-management-detail-can-login.component';

describe('UserManagementDetailCanLoginComponent', () => {
  let component: RoleManagementDetailCanLoginComponent;
  let fixture: ComponentFixture<RoleManagementDetailCanLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleManagementDetailCanLoginComponent],
      providers: [stubRoleManagementServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementDetailCanLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
