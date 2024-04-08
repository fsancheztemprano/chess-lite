import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { scopeLoader } from '@app/transloco-scope';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TicTacToeEffects } from './store/tic-tac-toe.effects';
import { TicTacToeRoutingModule } from './tic-tac-toe-routing.module';

@NgModule({
  imports: [CommonModule, TicTacToeRoutingModule],
  providers: [
    TicTacToeEffects,
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: 'tic-tac-toe',
        alias: 'tic-tac-toe',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class TicTacToeModule {
  constructor(private readonly effects: TicTacToeEffects) {}
}
