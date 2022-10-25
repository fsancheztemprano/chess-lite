import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationHomeComponent } from './components/home/administration-home.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationHomeComponent,
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
export class AdministrationHomeRoutingModule {}
