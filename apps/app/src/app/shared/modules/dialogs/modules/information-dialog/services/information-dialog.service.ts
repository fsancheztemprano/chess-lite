import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { InformationDialogData } from '../../../model/dialogs.model';
import { InformationDialogComponent } from '../components/information-dialog/information-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class InformationDialogService {
  constructor(public readonly dialog: MatDialog) {}

  openDialog(data: InformationDialogData): Observable<void> {
    const dialogRef = this.dialog.open(InformationDialogComponent, {
      data,
    });

    return dialogRef.afterClosed();
  }
}
