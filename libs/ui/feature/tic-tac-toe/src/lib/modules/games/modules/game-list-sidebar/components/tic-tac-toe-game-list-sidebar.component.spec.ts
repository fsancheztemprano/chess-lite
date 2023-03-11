import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeGameListSidebarComponent } from './tic-tac-toe-game-list-sidebar.component';

describe('TicTacToeGameListSidebarComponent', () => {
  let component: TicTacToeGameListSidebarComponent;
  let fixture: ComponentFixture<TicTacToeGameListSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeGameListSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
