import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { scopeLoader } from '@app/transloco-scope';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [CommonModule, HomeRoutingModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: 'home',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class HomeModule {}
