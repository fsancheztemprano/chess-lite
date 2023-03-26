import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StubCoreCardViewComponent } from '@app/ui/shared/common';
import { BreakpointModule } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientTestingModule } from '@hal-form-client';
import { TranslocoModule } from '@ngneat/transloco';

import { TicTacToeGameListComponent } from './tic-tac-toe-game-list.component';

describe('TicTacToeGameListComponent', () => {
  let component: TicTacToeGameListComponent;
  let fixture: ComponentFixture<TicTacToeGameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HalFormClientTestingModule,
        getTranslocoModule(),
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        BreakpointModule,
        TranslocoModule,
      ],
      declarations: [TicTacToeGameListComponent, StubCoreCardViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
