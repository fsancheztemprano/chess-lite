import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { IsMobileModule } from '../../../../../shared/modules/is-mobile/is-mobile.module';
import { CardViewHeaderComponent } from './card-view-header.component';

describe('CardViewHeaderComponent', () => {
  let component: CardViewHeaderComponent;
  let fixture: ComponentFixture<CardViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsMobileModule, MatIconModule, RouterTestingModule, MatTabsModule],
      declarations: [CardViewHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
