import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeGameListComponent } from './tic-tac-toe-game-list.component';

describe('TicTacToeGameListComponent', () => {
  let component: TicTacToeGameListComponent;
  let fixture: ComponentFixture<TicTacToeGameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeGameListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
