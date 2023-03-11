import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { ticTacToeGameListResolver } from './tic-tac-toe-game-list.resolver';

describe('ticTacToeGameListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => ticTacToeGameListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
