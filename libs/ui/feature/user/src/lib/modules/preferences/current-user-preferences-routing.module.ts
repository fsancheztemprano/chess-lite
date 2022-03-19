import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentUserPreferencesComponent } from './components/user-preferences/current-user-preferences.component';

const routes: Routes = [
  {
    path: '',
    component: CurrentUserPreferencesComponent,
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
export class CurrentUserPreferencesRoutingModule {}
