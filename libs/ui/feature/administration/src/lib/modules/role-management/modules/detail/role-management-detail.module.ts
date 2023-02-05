import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CoreCardViewModule, FormErrorModule } from '@app/ui/shared/common';
import { NgLetModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
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
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class RoleManagementDetailModule {}
