import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationThemeComponent } from './components/administration-theme.component';
import { ThemeResolver } from './resolvers/theme.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdministrationThemeComponent,
    resolve: { theme: ThemeResolver },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationThemeRoutingModule {}
