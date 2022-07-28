import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './services/dialog.service';

@NgModule({
  imports: [CommonModule, MatDialogModule],
  exports: [CommonModule, MatDialogModule],
  providers: [DialogService],
})
export class DialogsModule {}
