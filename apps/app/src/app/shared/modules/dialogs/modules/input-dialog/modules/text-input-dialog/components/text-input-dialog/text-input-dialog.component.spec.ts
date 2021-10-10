import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedDialogModule } from '../../../../../shared-dialog/shared-dialog.module';

import { TextInputDialogComponent } from './text-input-dialog.component';

describe('TextInputDialogComponent', () => {
  let component: TextInputDialogComponent;
  let fixture: ComponentFixture<TextInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule, SharedDialogModule],
      declarations: [TextInputDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
