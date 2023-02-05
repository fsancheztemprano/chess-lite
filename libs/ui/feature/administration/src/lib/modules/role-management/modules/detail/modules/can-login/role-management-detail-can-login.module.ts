import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { RoleManagementDetailCanLoginComponent } from './components/can-login/role-management-detail-can-login.component';

@NgModule({
  declarations: [RoleManagementDetailCanLoginComponent],
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSlideToggleModule, TranslocoModule],
  exports: [RoleManagementDetailCanLoginComponent],
})
export class RoleManagementDetailCanLoginModule {}
