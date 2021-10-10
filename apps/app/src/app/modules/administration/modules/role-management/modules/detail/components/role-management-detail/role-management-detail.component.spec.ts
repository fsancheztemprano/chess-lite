import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Role } from '@app/domain';
import { Observable } from 'rxjs';
import { stubCardViewHeaderServiceProvider } from '../../../../../../../../core/modules/card-view/services/card-view-header.service.stub';
import { stubMessageServiceProvider } from '../../../../../../../../core/services/message.service.stub';
import { stubRoleManagementServiceProvider } from '../../../../services/role-management.service.stub';
import { RoleManagementDetailAuthoritiesComponent } from '../role-management-detail-authorities/role-management-detail-authorities.component';
import { RoleManagementDetailNameComponent } from '../role-management-detail-name/role-management-detail-name.component';
import { RoleManagementDetailComponent } from './role-management-detail.component';

@Component({ selector: 'app-role-management-detail-authorities', template: '' })
export class StubRoleManagementDetailAuthoritiesComponent implements Partial<RoleManagementDetailAuthoritiesComponent> {
  @Input() role!: Observable<Role>;
}

@Component({ selector: 'app-role-management-detail-name', template: '' })
export class StubRoleManagementDetailNameComponent implements Partial<RoleManagementDetailNameComponent> {
  @Input() role!: Observable<Role>;
}

describe('RoleManagementDetailComponent', () => {
  let component: RoleManagementDetailComponent;
  let fixture: ComponentFixture<RoleManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        RoleManagementDetailComponent,
        StubRoleManagementDetailAuthoritiesComponent,
        StubRoleManagementDetailNameComponent,
      ],
      providers: [stubCardViewHeaderServiceProvider, stubMessageServiceProvider, stubRoleManagementServiceProvider],
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
