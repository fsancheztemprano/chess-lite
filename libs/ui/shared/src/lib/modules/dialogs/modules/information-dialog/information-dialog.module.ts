import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedDialogModule } from '../shared-dialog/shared-dialog.module';
import { InformationDialogComponent } from './components/information-dialog/information-dialog.component';

@NgModule({
  declarations: [InformationDialogComponent],
  imports: [CommonModule, MatDialogModule, SharedDialogModule],
})
export class InformationDialogModule {}
