import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyTranslocoModule } from '@app/ui/shared/custom-forms';
import { getTranslocoModule } from '@app/ui/testing';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';

import { TicTacToeHomeSidebarComponent } from './tic-tac-toe-home-sidebar.component';

describe('TicTacToeHomeSidebarComponent', () => {
  let component: TicTacToeHomeSidebarComponent;
  let fixture: ComponentFixture<TicTacToeHomeSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        NoopAnimationsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        FormlyMatToggleModule,
        FormlyTranslocoModule,
        getTranslocoModule(),
      ],
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
