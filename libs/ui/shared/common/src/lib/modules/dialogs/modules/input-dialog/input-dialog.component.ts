import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { setTemplateValidator } from '../../../../utils/forms/validators/set-template.validators';
import { DialogsModule } from '../../dialogs.module';
import { InputDialogData } from '../../model/dialogs.model';
import { DialogActionsButtonModule } from '../dialog-actions-button/dialog-actions-button.component';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDialogComponent implements OnInit {
  public readonly form = new FormArray<FormGroup>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: InputDialogData) {}

  ngOnInit(): void {
    if (this.data?.inputs) {
      for (const input of this.data.inputs) {
        const valueControl = new FormControl(input.options?.defaultValue);
        const formGroup = new FormGroup({
          input: new FormControl(input),
          value: valueControl,
        });
        if (this.data.template) {
          setTemplateValidator(valueControl, 'name', this.data.template);
          valueControl.updateValueAndValidity({ emitEvent: false });
        }
        this.form.push(formGroup);
      }
    }
  }

  getRawValue(): { [key: string]: string } {
    return this.form.value.reduce((acc, cur) => ({ ...acc, [cur.input.key]: cur.value }), {});
  }
}

@NgModule({
  declarations: [InputDialogComponent],
  imports: [DialogsModule, DialogActionsButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class InputDialogModule {}
