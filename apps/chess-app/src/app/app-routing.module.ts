import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const loadMainModule = () => import('./main/main.module').then((m) => m.MainModule);
export const loadAuthModule = () => import('./auth/auth.module').then((m) => m.AuthModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: loadMainModule,
  },
  {
    path: 'auth',
    loadChildren: loadAuthModule,
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
