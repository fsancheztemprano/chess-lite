import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationHomeComponent } from './components/administration-home/administration-home.component';

// const loadUserManagementModule = () =>
//   import('./').then((m) => m.);
const routes: Routes = [
  {
    path: '',
    component: AdministrationHomeComponent,
    children: [
      // {
      //   path: 'user-management',
      //   loadChildren: loadUserManagementModule,
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
