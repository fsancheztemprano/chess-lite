import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubTicTacToeServiceProvider } from '../services/tic-tac-toe.service.stub';

import { TicTacToeGuard } from './tic-tac-toe.guard';

describe('TicTacToeGuard', () => {
  let guard: TicTacToeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [stubTicTacToeServiceProvider],
    });
    guard = TestBed.inject(TicTacToeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
