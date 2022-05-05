import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreContextMenuModule, IsMobileModule } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { CoreCardViewComponent } from './core-card-view.component';

describe('CoreCardViewComponent', () => {
  let component: CoreCardViewComponent;
  let fixture: ComponentFixture<CoreCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IsMobileModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        CoreContextMenuModule,
        getTranslocoModule(),
      ],
      declarations: [CoreCardViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
