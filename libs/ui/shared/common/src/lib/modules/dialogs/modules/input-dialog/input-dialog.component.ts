import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { setTemplateValidators } from '../../../../utils/forms/validators/set-template.validators';
import { DialogsModule } from '../../dialogs.module';
import { InputDialogData } from '../../model/dialogs.model';
import { DialogActionsButtonModule } from '../dialog-actions-button/dialog-actions-button.component';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDialogComponent {
  public readonly form = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData,
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

@NgModule({
  declarations: [InputDialogComponent],
  imports: [DialogsModule, DialogActionsButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class InputDialogModule {}
