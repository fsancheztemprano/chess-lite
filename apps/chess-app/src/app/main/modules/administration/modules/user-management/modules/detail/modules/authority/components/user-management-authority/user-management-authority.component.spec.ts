import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementAuthorityComponent } from './user-management-authority.component';

describe('UserManagementAuthorityComponent', () => {
  let component: UserManagementAuthorityComponent;
  let fixture: ComponentFixture<UserManagementAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserManagementAuthorityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
