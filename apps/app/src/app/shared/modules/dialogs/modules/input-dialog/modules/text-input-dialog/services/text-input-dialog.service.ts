import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TextInputDialogData, TextInputDialogInput } from '../../../../../model/dialogs.model';
import { TextInputDialogComponent } from '../components/text-input-dialog/text-input-dialog.component';
import { TextInputDialogModule } from '../text-input-dialog.module';

@Injectable({
  providedIn: TextInputDialogModule,
})
export class TextInputDialogService {
  constructor(private readonly dialog: MatDialog) {}

  openDialog(data: TextInputDialogData): Observable<TextInputDialogInput[]> {
    const dialogRef = this.dialog.open(TextInputDialogComponent, {
      data,
    });

    return dialogRef.afterClosed();
  }
}
