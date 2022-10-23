import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadHomeTileModule = () => import('./modules/home-tile/home-tile.module').then((m) => m.HomeTileModule);

const loadBuildInfoModule = () => import('./modules/build-info/build-info.module').then((m) => m.BuildInfoModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadHomeTileModule,
    pathMatch: 'full',
  },
  {
    path: 'build-info',
    loadChildren: loadBuildInfoModule,
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
export class HomeRoutingModule {}
