import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

const loadMainModule = () => import('./main/main.module').then((m) => m.MainModule);
const loadAuthModule = () => import('./auth/auth.module').then((m) => m.AuthModule);

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
    loadChildren: loadMainModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
