import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserManagementAuthoritiesComponent } from '../user-management-authorities/user-management-authorities.component';
import { UserManagementRoleComponent } from '../user-management-role/user-management-role.component';

import { UserManagementAuthorityComponent } from './user-management-authority.component';

@Component({ selector: 'app-user-management-role', template: '' })
export class StubUserManagementRoleComponent implements Partial<UserManagementRoleComponent> {}

@Component({ selector: 'app-user-management-authorities', template: '' })
export class StubUserManagementAuthoritiesComponent implements Partial<UserManagementAuthoritiesComponent> {}

describe('UserManagementAuthorityComponent', () => {
  let component: UserManagementAuthorityComponent;
  let fixture: ComponentFixture<UserManagementAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        UserManagementAuthorityComponent,
        StubUserManagementRoleComponent,
        StubUserManagementAuthoritiesComponent,
      ],
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
