import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StubCoreCardViewComponent } from '@app/ui/shared/common';

import { TicTacToeGameComponent } from './tic-tac-toe-game.component';

describe('TicTacToeGameComponent', () => {
  let component: TicTacToeGameComponent;
  let fixture: ComponentFixture<TicTacToeGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TicTacToeGameComponent, StubCoreCardViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
