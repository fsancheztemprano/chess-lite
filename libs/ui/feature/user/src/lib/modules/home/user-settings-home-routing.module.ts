import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsHomeComponent } from './components/user-settings-home/user-settings-home.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsHomeComponent,
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
export class UserSettingsHomeRoutingModule {}
