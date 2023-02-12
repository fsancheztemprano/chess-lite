import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadLoginModule = () => import('./modules/login/login.module').then((m) => m.LoginModule);
const loadSignupModule = () => import('./modules/signup/signup.module').then((m) => m.SignupModule);
const loadActivationModule = () =>
  import('./modules/activation/account-activation.module').then((m) => m.AccountActivationModule);
const loadTokenModule = () => import('./modules/token/token-request.module').then((m) => m.TokenRequestModule);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: loadLoginModule,
    data: { breadcrumb: { label: 'authentication.login', i18n: true, parentOffset: 1 } },
  },
  {
    path: 'signup',
    loadChildren: loadSignupModule,
    data: { breadcrumb: { label: 'authentication.signup', i18n: true } },
  },
  {
    path: 'activation',
    loadChildren: loadActivationModule,
    data: { breadcrumb: { label: 'authentication.activation', i18n: true } },
  },
  {
    path: 'token-request',
    loadChildren: loadTokenModule,
    data: { breadcrumb: { label: 'authentication.token-request', i18n: true } },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
