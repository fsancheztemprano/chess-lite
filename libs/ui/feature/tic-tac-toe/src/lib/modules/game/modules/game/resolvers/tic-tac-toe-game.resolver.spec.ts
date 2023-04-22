import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { TicTacToeGame } from '@app/ui/shared/domain';

import { ticTacToeGameResolver } from './tic-tac-toe-game.resolver';

describe('ticTacToeGameResolver', () => {
  const executeResolver: ResolveFn<TicTacToeGame | null> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => ticTacToeGameResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
