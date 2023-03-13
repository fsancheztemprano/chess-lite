import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { scopeLoader } from '../../../../../../tools/transloco/transloco.scope';
import { TicTacToeEffects } from './store/tic-tac-toe.effects';
import { TicTacToeRoutingModule } from './tic-tac-toe-routing.module';

@NgModule({
  imports: [CommonModule, TicTacToeRoutingModule],
  providers: [
    TicTacToeEffects,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'tic-tac-toe',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class TicTacToeModule {
  constructor(private readonly effects: TicTacToeEffects) {}
}
