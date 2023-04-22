import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { TicTacToeService } from './tic-tac-toe.service';

@Injectable({ providedIn: 'root' })
export class StubTicTacToeService implements Partial<TicTacToeService> {
  hasGamesLink = () => of(true);
  hasCreateGameTemplate = () => of(true);
}

export const stubTicTacToeServiceProvider = {
  provide: TicTacToeService,
  useClass: StubTicTacToeService,
};
