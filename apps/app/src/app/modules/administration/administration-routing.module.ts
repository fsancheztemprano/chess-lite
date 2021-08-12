import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationHomeComponent } from './components/administration-home/administration-home.component';
import { UserManagementGuard } from './modules/user-management/guards/user-management.guard';

const loadUserManagementModule = () =>
  import('./modules/user-management/user-management.module').then((m) => m.UserManagementModule);

const routes: Routes = [
  {
    path: '',
    component: AdministrationHomeComponent,
    children: [
      {
        path: 'user-management',
        loadChildren: loadUserManagementModule,
        canLoad: [UserManagementGuard],
      },
      { path: '', redirectTo: 'user-management', pathMatch: 'full' },
      { path: '**', redirectTo: 'user-management' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
