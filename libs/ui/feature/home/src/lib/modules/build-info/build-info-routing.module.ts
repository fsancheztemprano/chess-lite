import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildInfoComponent } from './components/build-info.component';
import { BuildInfoService } from './services/build-info.service';

const routes: Routes = [
  {
    path: '',
    component: BuildInfoComponent,
    resolve: { buildInfo: () => inject(BuildInfoService).getBuildInfo() },
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
export class BuildInfoRoutingModule {}
