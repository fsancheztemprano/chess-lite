import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TicTacToeGame } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';

export const ticTacToeGameResolver: ResolveFn<TicTacToeGame> = (route) => {
  const service = inject(TicTacToeService);
  return service.getGame(route.params.gameId);
};
