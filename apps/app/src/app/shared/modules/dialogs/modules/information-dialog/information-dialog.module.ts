import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InformationDialogComponent } from './components/information-dialog/information-dialog.component';

@NgModule({
  declarations: [InformationDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
})
export class InformationDialogModule {}
