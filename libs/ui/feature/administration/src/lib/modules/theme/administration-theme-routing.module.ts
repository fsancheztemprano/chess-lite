import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeService } from '@app/ui/shared/app';
import { AdministrationThemeComponent } from './components/administration-theme.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationThemeComponent,
    resolve: { theme: () => inject(ThemeService).getTheme() },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationThemeRoutingModule {}
