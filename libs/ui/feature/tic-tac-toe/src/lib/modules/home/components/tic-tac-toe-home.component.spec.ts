import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeHomeComponent } from './tic-tac-toe-home.component';

describe('TicTacToeHomeComponent', () => {
  let component: TicTacToeHomeComponent;
  let fixture: ComponentFixture<TicTacToeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
