import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRemoveAccountComponent } from './components/user-remove-account/user-remove-account.component';

const routes: Routes = [
  {
    path: '',
    component: UserRemoveAccountComponent,
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
