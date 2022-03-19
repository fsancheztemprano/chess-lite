import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceLogsComponent } from './components/service-logs/service-logs.component';
import { ServiceLogsResolver } from './resolvers/service-logs.resolver';

const routes: Routes = [
  {
    path: '',
    component: ServiceLogsComponent,
    resolve: { serviceLogs: ServiceLogsResolver },
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
