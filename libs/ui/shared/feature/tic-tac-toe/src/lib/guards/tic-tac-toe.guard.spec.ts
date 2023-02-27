import { TestBed } from '@angular/core/testing';

import { TicTacToeGuard } from './tic-tac-toe.guard';

describe('TicTacToeGuard', () => {
  let guard: TicTacToeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TicTacToeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
