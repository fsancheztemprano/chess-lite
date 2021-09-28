import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ServiceLogsComponent } from './components/service-logs/service-logs.component';
import { ServiceLogsRoutingModule } from './service-logs-routing.module';

@NgModule({
  declarations: [ServiceLogsComponent],
  imports: [CommonModule, ServiceLogsRoutingModule, MatFormFieldModule, MatInputModule],
})
export class ServiceLogsModule {}
