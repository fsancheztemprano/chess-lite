import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { RoleManagementDetailCanLoginModule } from '../../../role-management/modules/detail/modules/can-login/role-management-detail-can-login.module';
import { GlobalSettingsAccessRestrictionsComponent } from './components/access-restrictions/global-settings-access-restrictions.component';

import { GlobalSettingsAccessRestrictionsRoutingModule } from './global-settings-access-restrictions-routing.module';

@NgModule({
  declarations: [GlobalSettingsAccessRestrictionsComponent],
  imports: [
    CommonModule,
    GlobalSettingsAccessRestrictionsRoutingModule,
    RoleManagementDetailCanLoginModule,
    TranslocoModule,
  ],
})
export class GlobalSettingsAccessRestrictionsModule {}
