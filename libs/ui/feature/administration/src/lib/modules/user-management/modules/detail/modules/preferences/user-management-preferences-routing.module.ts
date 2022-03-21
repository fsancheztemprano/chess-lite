import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementPreferencesComponent } from './components/user-management-preferences/user-management-preferences.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementPreferencesComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementPreferencesRoutingModule {}
