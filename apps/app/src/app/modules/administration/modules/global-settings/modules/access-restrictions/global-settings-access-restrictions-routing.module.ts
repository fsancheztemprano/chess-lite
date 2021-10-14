import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalSettingsAccessRestrictionsComponent } from './components/access-restrictions/global-settings-access-restrictions.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalSettingsAccessRestrictionsComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSettingsAccessRestrictionsRoutingModule {}
