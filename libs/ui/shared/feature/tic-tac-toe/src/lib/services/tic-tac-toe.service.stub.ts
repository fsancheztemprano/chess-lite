import { Injectable } from '@angular/core';
import { TicTacToeService } from './tic-tac-toe.service';

@Injectable({ providedIn: 'root' })
export class StubTicTacToeService implements Partial<TicTacToeService> {}

export const stubTicTacToeServiceProvider = {
  provide: TicTacToeService,
  useClass: StubTicTacToeService,
};
