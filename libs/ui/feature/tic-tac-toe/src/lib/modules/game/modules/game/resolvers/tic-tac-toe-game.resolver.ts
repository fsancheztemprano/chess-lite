import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { switchMap } from 'rxjs';
import { TicTacToeGameService, TicTacToeUiGame } from '../../../services/tic-tac-toe-game.service';

export const ticTacToeGameResolver: ResolveFn<TicTacToeUiGame | null> = (route) => {
  const service = inject(TicTacToeService);
  const gameService = inject(TicTacToeGameService);
  return service.getGame(route.params.gameId).pipe(switchMap((game) => gameService.init(game)));
};
