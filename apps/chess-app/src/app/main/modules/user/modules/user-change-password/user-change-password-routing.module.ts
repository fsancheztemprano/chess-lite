import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentUserResolver } from '../../resolvers/current-user.resolver';
import { UserChangePasswordComponent } from './components/user-change-password/user-change-password.component';

const routes: Routes = [
  {
    path: '',
    component: UserChangePasswordComponent,
    resolve: { user: CurrentUserResolver },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserChangePasswordRoutingModule {}
