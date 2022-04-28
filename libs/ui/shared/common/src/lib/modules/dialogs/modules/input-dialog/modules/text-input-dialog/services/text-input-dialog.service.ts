import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TextInputDialogData } from '../../../../../model/dialogs.model';
import { TextInputDialogComponent } from '../components/text-input-dialog/text-input-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class TextInputDialogService {
  constructor(private readonly dialog: MatDialog) {}

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  openDialog(data: TextInputDialogData): Observable<any> {
    const dialogRef = this.dialog.open(TextInputDialogComponent, {
      data,
    });

    return dialogRef.afterClosed();
  }
}
