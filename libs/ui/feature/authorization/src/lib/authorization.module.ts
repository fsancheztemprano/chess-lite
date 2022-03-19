import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthorizationRoutingModule } from './authorization-routing.module';

@NgModule({
  imports: [CommonModule, AuthorizationRoutingModule],
})
export class AuthorizationModule {}
