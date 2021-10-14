import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalSettingsGeneralComponent } from './components/general/global-settings-general.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalSettingsGeneralComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSettingsGeneralRoutingModule {}
