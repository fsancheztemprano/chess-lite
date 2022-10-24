import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildInfoComponent } from './components/build-info.component';
import { BuildInfoResolver } from './resolvers/build-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: BuildInfoComponent,
    resolve: { buildInfo: BuildInfoResolver },
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
