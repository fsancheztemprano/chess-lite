import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgLetModule } from '../../../../../ng-let/ng-let.module';
import { SharedDialogModule } from '../../../shared-dialog/shared-dialog.module';
import { TextInputDialogComponent } from './components/text-input-dialog/text-input-dialog.component';

@NgModule({
  declarations: [TextInputDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgLetModule,
    SharedDialogModule,
  ],
})
export class TextInputDialogModule {}
