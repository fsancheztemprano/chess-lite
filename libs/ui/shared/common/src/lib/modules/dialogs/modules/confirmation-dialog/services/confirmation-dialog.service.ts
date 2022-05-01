import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogData } from '../../../model/dialogs.model';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogModule } from '../confirmation-dialog.module';

@Injectable({
  providedIn: ConfirmationDialogModule,
})
export class ConfirmationDialogService {
  constructor(private readonly dialog: MatDialog) {}

  openDialog(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
    });

    return dialogRef.afterClosed();
  }
}
