import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementTableComponent } from '../user-management-table/user-management-table.component';
import { UserManagementHomeComponent } from './user-management-home.component';

@Component({ selector: 'app-user-management-table', template: '' })
class StubUserManagementTableComponent implements Partial<UserManagementTableComponent> {}

describe('UserManagementHomeComponent', () => {
  let component: UserManagementHomeComponent;
  let fixture: ComponentFixture<UserManagementHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserManagementHomeComponent, StubUserManagementTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
