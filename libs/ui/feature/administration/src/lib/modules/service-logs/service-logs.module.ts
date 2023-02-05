import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CoreCardViewModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { ServiceLogsComponent } from './components/service-logs/service-logs.component';
import { ServiceLogsRoutingModule } from './service-logs-routing.module';

@NgModule({
  declarations: [ServiceLogsComponent],
  imports: [
    CommonModule,
    ServiceLogsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    CoreCardViewModule,
    TranslocoModule,
  ],
})
export class ServiceLogsModule {}
