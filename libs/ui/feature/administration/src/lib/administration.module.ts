import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { scopeLoader } from '../../../../../../tools/transloco/transloco.scope';
import { AdministrationRoutingModule } from './administration-routing.module';

@NgModule({
  imports: [CommonModule, AdministrationRoutingModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'administration',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class AdministrationModule {}
