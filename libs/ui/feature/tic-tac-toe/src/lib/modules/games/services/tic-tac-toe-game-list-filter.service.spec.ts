import { TestBed } from '@angular/core/testing';

import { TicTacToeGameListFilterService } from './tic-tac-toe-game-list-filter.service';

describe('TicTacToeGameListFilterService', () => {
  let service: TicTacToeGameListFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicTacToeGameListFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
