import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { stubTicTacToeServiceProvider } from '@app/ui/shared/feature/tic-tac-toe';

import { TicTacToeGameListSidebarComponent } from './tic-tac-toe-game-list-sidebar.component';

describe('TicTacToeGameListSidebarComponent', () => {
  let component: TicTacToeGameListSidebarComponent;
  let fixture: ComponentFixture<TicTacToeGameListSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTabsModule],
      declarations: [TicTacToeGameListSidebarComponent],
      providers: [stubTicTacToeServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameListSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
