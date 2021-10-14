import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RoleManagementDetailCanLoginComponent } from './components/can-login/role-management-detail-can-login.component';

@NgModule({
  declarations: [RoleManagementDetailCanLoginComponent],
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSlideToggleModule],
  exports: [RoleManagementDetailCanLoginComponent],
})
export class RoleManagementDetailCanLoginModule {}
