import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentUserResolver } from '../../resolvers/current-user.resolver';
import { UserRemoveAccountComponent } from './components/user-remove-account/user-remove-account.component';

const routes: Routes = [
  {
    path: '',
    component: UserRemoveAccountComponent,
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
export class UserRemoveAccountRoutingModule {}
