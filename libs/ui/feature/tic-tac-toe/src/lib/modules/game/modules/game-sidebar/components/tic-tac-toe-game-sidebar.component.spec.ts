import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeGameSidebarComponent } from './tic-tac-toe-game-sidebar.component';

describe('TicTacToeGameSidebarComponent', () => {
  let component: TicTacToeGameSidebarComponent;
  let fixture: ComponentFixture<TicTacToeGameSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeGameSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
