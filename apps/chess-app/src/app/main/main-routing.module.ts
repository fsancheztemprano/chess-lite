import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyComponent } from './components/dummy/dummy.component';
import { UserRootGuard } from './modules/user/guards/user-root.guard';

const loadUserModule = () => import('./modules/user/user.module').then((m) => m.UserModule);

const routes: Routes = [
  {
    path: '',
    component: DummyComponent,
  },
  {
    path: 'user',
    loadChildren: loadUserModule,
    canLoad: [UserRootGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
