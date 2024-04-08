import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { scopeLoader } from '@app/transloco-scope';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AdministrationRoutingModule } from './administration-routing.module';

@NgModule({
  imports: [CommonModule, AdministrationRoutingModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: 'administration',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class AdministrationModule {}
