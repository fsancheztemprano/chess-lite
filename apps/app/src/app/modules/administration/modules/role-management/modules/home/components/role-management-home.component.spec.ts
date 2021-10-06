import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementHomeComponent } from './role-management-home.component';

describe('RoleManagementHomeComponent', () => {
  let component: RoleManagementHomeComponent;
  let fixture: ComponentFixture<RoleManagementHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleManagementHomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
