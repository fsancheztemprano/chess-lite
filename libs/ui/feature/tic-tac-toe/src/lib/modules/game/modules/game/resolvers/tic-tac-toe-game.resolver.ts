import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TicTacToeGame } from '@app/ui/shared/domain';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { switchMap } from 'rxjs';
import { TicTacToeGameService } from '../../../services/tic-tac-toe-game.service';

export const ticTacToeGameResolver: ResolveFn<TicTacToeGame | null> = (route) => {
  const service = inject(TicTacToeService);
  const gameService = inject(TicTacToeGameService);
  return service.getGame(route.params.gameId).pipe(switchMap((game) => gameService.init(game)));
};
