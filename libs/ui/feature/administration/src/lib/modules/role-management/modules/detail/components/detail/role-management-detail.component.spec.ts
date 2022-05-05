import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider } from '@app/ui/shared/app';
import { StubCoreCardViewComponent } from '@app/ui/shared/common';
import { Role } from '@app/ui/shared/domain';
import { getTranslocoModule, StubRouteDataProvider } from '@app/ui/testing';
import { Observable } from 'rxjs';
import { stubRoleManagementServiceProvider } from '../../../../services/role-management.service.stub';
import { RoleManagementDetailCanLoginComponent } from '../../modules/can-login/components/can-login/role-management-detail-can-login.component';
import { RoleManagementDetailAuthoritiesComponent } from '../detail-authorities/role-management-detail-authorities.component';
import { RoleManagementDetailNameComponent } from '../detail-name/role-management-detail-name.component';
import { RoleManagementDetailComponent } from './role-management-detail.component';

@Component({ selector: 'app-role-management-detail-authorities', template: '' })
export class StubRoleManagementDetailAuthoritiesComponent implements Partial<RoleManagementDetailAuthoritiesComponent> {
  @Input() role$!: Observable<Role>;
}

@Component({ selector: 'app-role-management-detail-name', template: '' })
export class StubRoleManagementDetailNameComponent implements Partial<RoleManagementDetailNameComponent> {
  @Input() role$!: Observable<Role>;
}

@Component({ selector: 'app-role-management-detail-can-login', template: '' })
export class StubRoleManagementDetailCanLoginComponent implements Partial<RoleManagementDetailCanLoginComponent> {
  @Input() role$!: Observable<Role>;
  @Input() showRoleName = false;
  @Input() showCanLoginLabel = false;
}

describe('RoleManagementDetailComponent', () => {
  let component: RoleManagementDetailComponent;
  let fixture: ComponentFixture<RoleManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, getTranslocoModule()],
      declarations: [
        RoleManagementDetailComponent,
        StubRoleManagementDetailAuthoritiesComponent,
        StubRoleManagementDetailNameComponent,
        StubRoleManagementDetailCanLoginComponent,
        StubCoreCardViewComponent,
      ],
      providers: [
        StubRouteDataProvider({ role: new Role({}) }),
        stubMessageServiceProvider,
        stubRoleManagementServiceProvider,
      ],
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
