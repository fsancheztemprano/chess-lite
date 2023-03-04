import { ComponentFixture, TestBed } from '@angular/core/testing';
import { stubTicTacToeServiceProvider } from '@app/ui/shared/feature/tic-tac-toe';
import { getTranslocoModule } from '@app/ui/testing';
import { TicTacToeHomeComponent } from './tic-tac-toe-home.component';

describe('TicTacToeHomeComponent', () => {
  let component: TicTacToeHomeComponent;
  let fixture: ComponentFixture<TicTacToeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      declarations: [TicTacToeHomeComponent],
      providers: [stubTicTacToeServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
