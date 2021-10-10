import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementDetailNameComponent } from './role-management-detail-name.component';

describe('RoleManagementDetailNameComponent', () => {
  let component: RoleManagementDetailNameComponent;
  let fixture: ComponentFixture<RoleManagementDetailNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleManagementDetailNameComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementDetailNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
