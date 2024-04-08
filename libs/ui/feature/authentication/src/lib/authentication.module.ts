import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { scopeLoader } from '@app/transloco-scope';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
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
