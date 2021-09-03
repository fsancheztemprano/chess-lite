import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentUserPreferencesComponent } from './components/user-preferences/current-user-preferences.component';
import { CurrentUserPreferencesResolver } from './resolvers/current-user-preferences.resolver';

const routes: Routes = [
  {
    path: '',
    component: CurrentUserPreferencesComponent,
    resolve: { userPreferences: CurrentUserPreferencesResolver },
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
