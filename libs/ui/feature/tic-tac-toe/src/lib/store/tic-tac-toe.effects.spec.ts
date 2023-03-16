import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client';
import { TicTacToeEffects } from './tic-tac-toe.effects';

describe('TicTacToeEffectsService', () => {
  let service: TicTacToeEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
    });
    service = TestBed.inject(TicTacToeEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
