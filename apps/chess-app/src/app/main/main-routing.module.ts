import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyComponent } from './components/dummy/dummy.component';
import { AdministrationGuard } from './modules/administration/guards/administration.guard';
import { UserGuard } from './modules/user/guards/user.guard';

const loadUserModule = () => import('./modules/user/user.module').then((m) => m.UserModule);
const loadAdministrationModule = () =>
  import('./modules/administration/administration.module').then((m) => m.AdministrationModule);

const routes: Routes = [
  {
    path: '',
    component: DummyComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
