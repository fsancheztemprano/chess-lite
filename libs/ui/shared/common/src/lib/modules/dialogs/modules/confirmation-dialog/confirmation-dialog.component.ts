import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogsModule } from '../../dialogs.module';
import { ConfirmationDialogData } from '../../model/dialogs.model';
import { DialogActionsButtonModule } from '../dialog-actions-button/dialog-actions-button.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}
}

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [DialogsModule, DialogActionsButtonModule],
})
export class ConfirmationDialogModule {}
