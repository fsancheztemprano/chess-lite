import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { scopeLoader } from '../../../../../../tools/transloco/transloco.scope';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  imports: [CommonModule, AuthenticationRoutingModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: 'authentication',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class AuthenticationModule {}
