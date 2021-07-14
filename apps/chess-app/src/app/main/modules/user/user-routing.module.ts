import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

const loadUserProfileModule = () =>
  import('./modules/user-profile/user-profile.module').then((m) => m.UserProfileModule);

const loadUserRemoveAccountModule = () =>
  import('./modules/user-remove-account/user-remove-account.module').then((m) => m.UserRemoveAccountModule);

const routes: Routes = [
  {
    path: '',
    component: UserMenuComponent,
    children: [
      {
        path: 'profile',
        loadChildren: loadUserProfileModule,
      },
      {
        path: 'delete',
        loadChildren: loadUserRemoveAccountModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
