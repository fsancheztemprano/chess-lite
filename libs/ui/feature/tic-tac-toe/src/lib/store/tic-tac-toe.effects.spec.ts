import { TestBed } from '@angular/core/testing';

import { TicTacToeEffects } from './tic-tac-toe.effects.service';

describe('TicTacToeEffectsService', () => {
  let service: TicTacToeEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicTacToeEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
