import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeGameBoardComponent } from './tic-tac-toe-game-board.component';

describe('TicTacToeGameBoardComponent', () => {
  let component: TicTacToeGameBoardComponent;
  let fixture: ComponentFixture<TicTacToeGameBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicTacToeGameBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
