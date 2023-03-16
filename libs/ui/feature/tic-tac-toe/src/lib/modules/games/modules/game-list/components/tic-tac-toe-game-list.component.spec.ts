import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointModule } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientTestingModule } from '@hal-form-client';

import { TicTacToeGameListComponent } from './tic-tac-toe-game-list.component';

describe('TicTacToeGameListComponent', () => {
  let component: TicTacToeGameListComponent;
  let fixture: ComponentFixture<TicTacToeGameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule, getTranslocoModule(), BreakpointModule],
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
