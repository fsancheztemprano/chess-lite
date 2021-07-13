import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

const loadUserProfileModule = () =>
  import('./modules/user-profile/user-profile.module').then((m) => m.UserProfileModule);

const routes: Routes = [
  {
    path: '',
    component: UserMenuComponent,
    children: [
      {
        path: 'profile',
        loadChildren: loadUserProfileModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
