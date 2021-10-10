import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedDialogModule } from '../shared-dialog/shared-dialog.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, MatDialogModule, SharedDialogModule],
})
export class ConfirmationDialogModule {}
