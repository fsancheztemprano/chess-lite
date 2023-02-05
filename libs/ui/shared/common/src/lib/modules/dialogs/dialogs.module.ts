import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DialogService } from './services/dialog.service';

@NgModule({
  imports: [CommonModule, MatDialogModule],
  exports: [CommonModule, MatDialogModule],
  providers: [DialogService],
})
export class DialogsModule {}
