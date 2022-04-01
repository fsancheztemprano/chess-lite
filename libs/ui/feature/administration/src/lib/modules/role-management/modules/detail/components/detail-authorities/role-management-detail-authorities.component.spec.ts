import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubToasterServiceProvider } from '@app/ui/shared/app';
import { NgLetModule } from '@app/ui/shared/core';
import { stubRoleManagementServiceProvider } from '../../../../services/role-management.service.stub';
import { RoleManagementDetailAuthoritiesComponent } from './role-management-detail-authorities.component';

describe('RoleManagementDetailAuthoritiesComponent', () => {
  let component: RoleManagementDetailAuthoritiesComponent;
  let fixture: ComponentFixture<RoleManagementDetailAuthoritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgLetModule],
      declarations: [RoleManagementDetailAuthoritiesComponent],
      providers: [stubRoleManagementServiceProvider, stubToasterServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementDetailAuthoritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
