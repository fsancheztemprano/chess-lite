import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeNewGameComponent } from './tic-tac-toe-new-game.component';

describe('TicTacToeNewGameComponent', () => {
  let component: TicTacToeNewGameComponent;
  let fixture: ComponentFixture<TicTacToeNewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeNewGameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeNewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
