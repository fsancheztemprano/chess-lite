import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeHomeSidebarComponent } from './tic-tac-toe-home-sidebar.component';

describe('TicTacToeHomeSidebarComponent', () => {
  let component: TicTacToeHomeSidebarComponent;
  let fixture: ComponentFixture<TicTacToeHomeSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeHomeSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeHomeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
