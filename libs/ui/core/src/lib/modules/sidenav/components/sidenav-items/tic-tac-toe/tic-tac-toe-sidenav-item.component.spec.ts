import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientTestingModule } from '@hal-form-client';
import { StubSidenavItemComponent } from '../../sidenav-item/sidenav-item.component.stub';
import { TicTacToeSidenavItemComponent } from './tic-tac-toe-sidenav-item.component';

describe('TicTacToeSidenavItemComponent', () => {
  let component: TicTacToeSidenavItemComponent;
  let fixture: ComponentFixture<TicTacToeSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule, getTranslocoModule()],
      declarations: [TicTacToeSidenavItemComponent, StubSidenavItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
