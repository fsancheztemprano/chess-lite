import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TicTacToeGameSidebarInfoComponent } from './tic-tac-toe-game-sidebar-info.component';

describe('TicTacToeGameSidebarInfoComponent', () => {
  let component: TicTacToeGameSidebarInfoComponent;
  let fixture: ComponentFixture<TicTacToeGameSidebarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeGameSidebarInfoComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameSidebarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
