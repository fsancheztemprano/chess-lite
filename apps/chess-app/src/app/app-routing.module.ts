import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@ui/auth';

const loadMainModule = () => import('./main/main.module').then((m) => m.MainModule);

const loadAuthModule = () => import('@ui/auth').then((m) => m.AuthModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadMainModule,
  },
  {
    path: 'auth',
    loadChildren: loadAuthModule,
    canLoad: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
