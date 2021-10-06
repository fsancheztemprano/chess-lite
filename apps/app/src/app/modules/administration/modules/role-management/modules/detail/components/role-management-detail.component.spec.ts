import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleManagementDetailComponent } from './role-management-detail.component';

describe('RoleManagementDetailComponent', () => {
  let component: RoleManagementDetailComponent;
  let fixture: ComponentFixture<RoleManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleManagementDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
