import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { RoleManagementDetailAuthoritiesComponent } from './components/detail-authorities/role-management-detail-authorities.component';
import { RoleManagementDetailNameComponent } from './components/detail-name/role-management-detail-name.component';
import { RoleManagementDetailComponent } from './components/detail/role-management-detail.component';
import { RoleManagementDetailCanLoginModule } from './modules/can-login/role-management-detail-can-login.module';
import { RoleManagementDetailRoutingModule } from './role-management-detail-routing.module';

@NgModule({
  declarations: [
    RoleManagementDetailComponent,
    RoleManagementDetailAuthoritiesComponent,
    RoleManagementDetailNameComponent,
  ],
  imports: [
    CommonModule,
    RoleManagementDetailRoutingModule,
    RoleManagementDetailCanLoginModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormErrorModule,
    MatButtonModule,
    MatCheckboxModule,
    NgLetModule,
  ],
})
export class RoleManagementDetailModule {}
