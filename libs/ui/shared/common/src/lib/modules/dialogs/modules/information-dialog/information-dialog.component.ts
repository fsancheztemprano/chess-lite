import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { DialogsModule } from '../../dialogs.module';
import { InformationDialogData } from '../../model/dialogs.model';
import { DialogActionsButtonModule } from '../dialog-actions-button/dialog-actions-button.component';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InformationDialogData,
  ) {}
}

@NgModule({
  declarations: [InformationDialogComponent],
  imports: [DialogsModule, DialogActionsButtonModule],
})
export class InformationDialogModule {}
