import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogActionsButtonComponent } from './components/dialog-actions-button/dialog-actions-button.component';

@NgModule({
  declarations: [DialogActionsButtonComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  exports: [DialogActionsButtonComponent],
})
export class SharedDialogModule {}
