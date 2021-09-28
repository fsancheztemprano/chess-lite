import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { CardViewHeaderComponent } from '../card-view-header/card-view-header.component';
import { CardViewComponent } from './card-view.component';

@Component({ selector: 'app-card-view-header', template: '' })
export class StubCardViewHeaderComponent implements Partial<CardViewHeaderComponent> {}

describe('CardViewComponent', () => {
  let component: CardViewComponent;
  let fixture: ComponentFixture<CardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [CardViewComponent, StubCardViewHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
