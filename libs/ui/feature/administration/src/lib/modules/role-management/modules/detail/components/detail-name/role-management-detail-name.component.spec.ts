import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { stubRoleManagementServiceProvider } from '../../../../services/role-management.service.stub';

import { RoleManagementDetailNameComponent } from './role-management-detail-name.component';

describe('RoleManagementDetailNameComponent', () => {
  let component: RoleManagementDetailNameComponent;
  let fixture: ComponentFixture<RoleManagementDetailNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      declarations: [RoleManagementDetailNameComponent],
      providers: [stubRoleManagementServiceProvider],
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
