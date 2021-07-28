import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserUpdateProfileComponent } from './components/user-update-profile/user-update-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserUpdateProfileComponent,
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
export class UserUpdateProfileRoutingModule {}
