import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { setTemplateValidators } from '../../../../../../../../utils/forms/validators/set-template.validators';
import { TextInputDialogData } from '../../../../../../model/dialogs.model';

@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputDialogComponent {
  form = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<TextInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextInputDialogData,
  ) {
    if (data) {
      this.data.inputs?.forEach((input) =>
        this.form.addControl(input.key, new FormControl(input.options?.defaultValue)),
      );
      if (data.template) {
        setTemplateValidators(this.form, data.template);
      }
    }
  }
}
