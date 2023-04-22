import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeGameSidebarMovesComponent } from './tic-tac-toe-game-sidebar-moves.component';

describe('TicTacToeGameSidebarMovesComponent', () => {
  let component: TicTacToeGameSidebarMovesComponent;
  let fixture: ComponentFixture<TicTacToeGameSidebarMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeGameSidebarMovesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameSidebarMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
