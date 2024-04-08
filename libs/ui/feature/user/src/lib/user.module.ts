import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { scopeLoader } from '@app/transloco-scope';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [CommonModule, UserRoutingModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: 'user',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class UserModule {}
