import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';

const routes: Routes = [
  {
    path: '',
    component: AccountActivationComponent,
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
export class AccountActivationRoutingModule {}
