import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementAccountComponent } from './user-management-account.component';

describe('UserManagementAccountComponent', () => {
  let component: UserManagementAccountComponent;
  let fixture: ComponentFixture<UserManagementAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserManagementAccountComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
