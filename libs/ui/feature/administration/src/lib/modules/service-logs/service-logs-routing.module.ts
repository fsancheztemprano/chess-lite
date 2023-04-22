import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceLogsComponent } from './components/service-logs/service-logs.component';
import { ServiceLogsService } from './services/service-logs.service';

const routes: Routes = [
  {
    path: '',
    component: ServiceLogsComponent,
    resolve: { serviceLogs: () => inject(ServiceLogsService).getServiceLogs() },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceLogsRoutingModule {}
