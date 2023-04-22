import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client';

import { TicTacToeService } from './tic-tac-toe.service';

describe('TicTacToeService', () => {
  let service: TicTacToeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HalFormClientTestingModule] });
    service = TestBed.inject(TicTacToeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
