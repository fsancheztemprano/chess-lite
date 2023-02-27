import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeSidenavItemComponent } from './tic-tac-toe-sidenav-item.component';

describe('TicTacToeSidenavItemComponent', () => {
  let component: TicTacToeSidenavItemComponent;
  let fixture: ComponentFixture<TicTacToeSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicTacToeSidenavItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
