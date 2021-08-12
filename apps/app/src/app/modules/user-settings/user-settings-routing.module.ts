import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

const loadUserUpdateProfileModule = () =>
  import('./modules/update-profile/user-update-profile.module').then((m) => m.UserUpdateProfileModule);

const loadUserRemoveAccountModule = () =>
  import('./modules/remove-account/user-remove-account.module').then((m) => m.UserRemoveAccountModule);

const loadUserChangePasswordModule = () =>
  import('./modules/change-password/user-change-password.module').then((m) => m.UserChangePasswordModule);

const loadUserUploadAvatarModule = () =>
  import('./modules/upload-avatar/user-upload-avatar.module').then((m) => m.UserUploadAvatarModule);

const routes: Routes = [
  {
    path: '',
    component: UserMenuComponent,
    children: [
      {
        path: 'profile',
        loadChildren: loadUserUpdateProfileModule,
      },
      {
        path: 'delete',
        loadChildren: loadUserRemoveAccountModule,
      },
      {
        path: 'password',
        loadChildren: loadUserChangePasswordModule,
      },
      {
        path: 'avatar',
        loadChildren: loadUserUploadAvatarModule,
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: '**', redirectTo: 'profile' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSettingsRoutingModule {}
