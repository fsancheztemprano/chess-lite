import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TextInputDialogData } from '../../../../../../model/dialogs.model';

@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputDialogComponent {
  inputs = new FormArray([]);

  constructor(
    public dialogRef: MatDialogRef<TextInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextInputDialogData,
  ) {
    this.data?.inputs?.forEach((input) =>
      this.inputs.push(
        new FormGroup({
          key: new FormControl(input.key),
          value: new FormControl({ value: input.options?.defaultValue, disabled: input.options?.disabled }),
          options: new FormControl(input.options),
        }),
      ),
    );
  }
}
