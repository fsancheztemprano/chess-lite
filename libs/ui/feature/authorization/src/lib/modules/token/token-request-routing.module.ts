import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenRequestComponent } from './components/token-request/token-request.component';

const routes: Routes = [
  {
    path: '',
    component: TokenRequestComponent,
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
export class TokenRequestRoutingModule {}
