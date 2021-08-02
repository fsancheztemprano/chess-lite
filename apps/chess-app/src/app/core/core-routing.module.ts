import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdministrationGuard } from '../modules/administration/guards/administration.guard';
import { UserGuard } from '../modules/user/guards/user.guard';
import { CoreComponent } from './components/core/core.component';

const loadUserModule = () => import('../modules/user/user.module').then((m) => m.UserModule);

const loadAdministrationModule = () =>
  import('../modules/administration/administration.module').then((m) => m.AdministrationModule);

const loadAuthModule = () => import('../auth/auth.module').then((m) => m.AuthModule);

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'auth',
        loadChildren: loadAuthModule,
        canLoad: [AuthGuard],
      },
      {
        path: 'user',
        loadChildren: loadUserModule,
        canLoad: [UserGuard],
      },
      {
        path: 'administration',
        loadChildren: loadAdministrationModule,
        canLoad: [AdministrationGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
